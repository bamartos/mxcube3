import update from 'react/lib/update';
import { omit } from 'lodash/object';

const initialState = {
  showRestoreDialog: false,
  searchString: '',
  displayData: {},
  visibleList: 'current',
  loading: false,
  showResumeQueueDialog: false,
  showConfirmCollectDialog: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'redux-form/CHANGE':
      if (action.form === 'search-sample') {
        return Object.assign({}, state, { searchString: action.value });
      }
      return state;
    case 'ADD_TASKS': {
      const displayData = { ...state.displayData };

      action.tasks.forEach((task) => {
        displayData[task.sampleID] = {
          ...displayData[task.sampleID],
          tasks: [...displayData[task.sampleID].tasks, { collapsed: false }]
        };
      });

      return Object.assign({}, state, { displayData });
    }
    case 'ADD_TASK_RESULT': {
      const displayData = {
        ...state.displayData,
        [action.sampleID]: {
          ...state.displayData[action.sampleID],
          tasks: [
            ...state.displayData[action.sampleID].tasks.slice(0, action.taskIndex),
            {
              ...state.displayData[action.sampleID].tasks[action.taskIndex],
              progress: action.progress
            },
            ...state.displayData[action.sampleID].tasks.slice(action.taskIndex + 1)
          ]
        }
      };

      return Object.assign({}, state, { displayData });
    }

    case 'ADD_SAMPLES_TO_QUEUE': {
      const samplesData = {};
      action.samplesData.forEach((sample) => {
        samplesData[sample.sampleID] = { collapsed: false, tasks: sample.tasks.map(() => {
          const task = { collapsed: false };
          return task;
        }) };
      });

      return Object.assign({}, state, { displayData: { ...state.displayData, ...samplesData } });
    }

    case 'REMOVE_SAMPLE_FROM_QUEUE':
      return Object.assign({}, state, { displayData: omit(state.displayData, action.sampleID) });

    case 'REMOVE_TASK': {
      const displayData = {
        ...state.displayData,
        [action.sampleID]: {
          ...state.displayData[action.sampleID],
          tasks: [...state.displayData[action.sampleID].tasks.slice(0, action.taskIndex),
                  ...state.displayData[action.sampleID].tasks.slice(action.taskIndex + 1)]
        }
      };
      return Object.assign({}, state, { displayData });
    }
    case 'COLLAPSE_SAMPLE': {
      const displayData = Object.assign({}, state.displayData);
      displayData[action.sampleID].collapsed ^= true;

      return { ...state, displayData };
    }
    case 'QUEUE_LOADING': {
      return { ...state, loading: action.loading };
    }
    // show list
    case 'SHOW_LIST':
      return {
        ...state,
        visibleList: action.list_name
      };
    case 'SHOW_RESUME_QUEUE_DIALOG': {
      return { ...state, showResumeQueueDialog: action.show };
    }
    case 'SHOW_CONFIRM_COLLECT_DIALOG': {
      return { ...state, showConfirmCollectDialog: action.show };
    }
    // Toggle task collapse flag
    case 'COLLAPSE_TASK': {
      const displayData = Object.assign({}, state.displayData);
      displayData[action.sampleID].tasks[action.taskIndex].collapsed ^= true;

      return { ...state, displayData };
    }
    case 'CHANGE_TASK_ORDER': {
      const displayData = Object.assign({}, state.displayData);

      displayData[action.sampleId].tasks = update(state.displayData[action.sampleId].tasks,
        {
          $splice: [[action.oldIndex, 1],
          [action.newIndex, 0,
          state.displayData[action.sampleId].tasks[action.oldIndex]]]
        });

      return { ...state, displayData };
    }
    case 'CLEAR_ALL':
      {
        return initialState;
      }
    default:
      return state;
  }
};
