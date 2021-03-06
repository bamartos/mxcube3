import update from 'react/lib/update';
import { QUEUE_STOPPED } from '../constants';

const initialState = {
  queue: [],
  current: { sampleID: null, running: false },
  queueStatus: QUEUE_STOPPED,
  autoMountNext: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_QUEUE': {
      const queue = {};
      action.queue.forEach(sample => { queue[sample.sampleID] = sample; });
      return Object.assign({}, initialState, { queue });
    }
    case 'CLEAR_QUEUE': {
      return Object.assign({}, state, { queue: initialState.queue,
                                        current: initialState.current });
    }
    case 'ADD_SAMPLES_TO_QUEUE': {
      const sampleIDList = action.samplesData.map((s) => s.sampleID);
      return Object.assign({}, state, { queue: state.queue.concat(sampleIDList) });
    }
    case 'SET_QUEUE_STATUS':
      return {
        ...state,
        queueStatus: action.queueState
      };

    case 'REMOVE_SAMPLES_FROM_QUEUE': {
      const queue = state.queue.filter((value) => !action.sampleIDList.includes(value));

      return Object.assign({}, state, { queue });
    }
    case 'SET_CURRENT_SAMPLE':
      return Object.assign({}, state,
        {
          current: { ...state.current, sampleID: action.sampleID, running: false },
        }
      );
    case 'CLEAR_CURRENT_SAMPLE':
      return Object.assign({}, state,
        {
          current: { sampleID: null, collapsed: false, running: false },
        }
      );
    case 'RUN_SAMPLE':
      return Object.assign({}, state, { current: { ...state.current, running: true } });
    case 'TOGGLE_CHECKED': {
      const queue = Object.assign({}, state.queue);
      queue[action.sampleID][action.taskIndex].checked ^= true;

      return { ...state, queue };
    }
    case 'CHANGE_SAMPLE_ORDER':
      return {
        ...state,
        [action.listName]: { ...state[action.listName],
                    sampleIDs: update(state[action.listName].sampleIDs, {
                      $splice: [
                            [action.oldIndex, 1],
                            [action.newIndex, 0, state[action.listName].sampleIDs[action.oldIndex]]
                      ] }) }
      };
    case 'SET_AUTO_MOUNT_SAMPLE': {
      return { ...state, autoMountNext: action.automount };
    }
    case 'CLEAR_ALL':
      {
        return Object.assign({}, state, { ...initialState, autoMountNext: state.autoMountNext });
      }
    case 'QUEUE_STATE':
      {
        return Object.assign({}, state, ...action.queueState);
      }
    case 'SET_INITIAL_STATE':
      {
        return {
          ...state,
          rootPath: action.data.beamlineSetup.path,
          queue: Object.keys(action.data.queue.queue),
          autoMountNext: action.data.queue.autoMountNext,
          current: { sampleID: action.data.queue.loaded,
                     running: action.data.queue.queueStatus }
        };
      }
    default:
      return state;
  }
};
