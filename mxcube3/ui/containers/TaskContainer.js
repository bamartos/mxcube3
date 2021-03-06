import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Characterisation from '../components/Tasks/Characterisation';
import DataCollection from '../components/Tasks/DataCollection';
import Helical from '../components/Tasks/Helical';
import AddSample from '../components/Tasks/AddSample';
import { hideTaskParametersForm, showTaskForm } from '../actions/taskForm';


import {
  addTask,
  updateTask,
  addSamplesToQueue,
  addSampleAndMount
} from '../actions/queue';

import {
  addSamplesToList
} from '../actions/sampleGrid';


class TaskContainer extends React.Component {
  constructor(props) {
    super(props);
    this.addSampleToQueue = this.addSampleToQueue.bind(this);
    this.addSampleAndMount = this.addSampleAndMount.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  addSampleToQueue(sampleData) {
    this.props.addSamplesToList([sampleData]);
    this.props.addSamplesToQueue([sampleData]);
  }

  addSampleAndMount(sampleData) {
    this.props.addSamplesToList([sampleData]);
    this.props.addSampleAndMount(sampleData);
  }

  addTask(params, stringFields, runNow) {
    const parameters = { ...params };

    for (const key in parameters) {
      if (parameters.hasOwnProperty(key) && stringFields.indexOf(key) === -1 && parameters[key]) {
        parameters[key] = Number(parameters[key]);
      }
    }

    if (this.props.sampleIds.constructor === Array) {
      this.props.addTask(this.props.sampleIds, parameters, runNow);
    } else {
      const { taskData, sampleIds } = this.props;
      const taskIndex = this.props.sampleList[sampleIds].tasks.indexOf(taskData);
      this.props.updateTask(sampleIds, taskIndex, parameters, runNow);
    }
  }

  render() {
    if (this.props.showForm === 'Characterisation') {
      return (<Characterisation
        show
        addTask={this.addTask}
        pointID={this.props.pointID}
        taskData={this.props.taskData}
        hide={this.props.hideTaskParametersForm}
        apertureList={this.props.apertureList}
        rootPath={this.props.path}
      />);
    }

    if (this.props.showForm === 'DataCollection') {
      return (<DataCollection
        show
        addTask={this.addTask}
        pointID={this.props.pointID}
        taskData={this.props.taskData}
        hide={this.props.hideTaskParametersForm}
        apertureList={this.props.apertureList}
        rootPath={this.props.path}
      />);
    }

    if (this.props.showForm === 'Helical') {
      return (<Helical
        show
        addTask={this.addTask}
        pointID={this.props.pointID}
        sampleIds={this.props.sampleIds}
        taskData={this.props.taskData}
        hide={this.props.hideTaskParametersForm}
        apertureList={this.props.apertureList}
        rootPath={this.props.path}
        lines={this.props.lines}
      />);
    }

    if (this.props.showForm === 'AddSample') {
      return (<AddSample
        show
        hide={this.props.hideTaskParametersForm}
        addToQueue={this.addSampleToQueue}
        addAndMount={this.addSampleAndMount}
      />);
    }

    return null;
  }
}


function mapStateToProps(state) {
  return {
    queue: state.queue.queue,
    sampleOrder: state.queue.sampleOrder,
    sampleList: state.sampleGrid.sampleList,
    showForm: state.taskForm.showForm,
    taskData: state.taskForm.taskData,
    sampleIds: state.taskForm.sampleIds,
    pointID: state.taskForm.pointID,
    apertureList: state.sampleview.apertureList,
    path: state.queue.rootPath,
    lines: state.sampleview.lines
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showTaskParametersForm: bindActionCreators(showTaskForm, dispatch),
    hideTaskParametersForm: bindActionCreators(hideTaskParametersForm, dispatch),
    updateTask: bindActionCreators(updateTask, dispatch),
    addTask: bindActionCreators(addTask, dispatch),
    addSamplesToList: bindActionCreators(addSamplesToList, dispatch),
    addSamplesToQueue: bindActionCreators(addSamplesToQueue, dispatch),
    addSampleAndMount: bindActionCreators(addSampleAndMount, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskContainer);

