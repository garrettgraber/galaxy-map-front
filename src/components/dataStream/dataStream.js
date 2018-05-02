import React from 'react';
import { connect } from 'react-redux';
import Clock from 'react-live-clock';
import uuidv4 from 'uuid/v4';

import * as DataStreamStyles from './dataStreamStyles.js';

const decodeTimeInMilliseconds = 100;
const copyRightText = 'Star Wars and all related locations, story, and information are copyright of Lucasfilm and Disney.';

class DataStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deCodedIndex: 0,
      dataMessage: '',
      dataMessageInEnglish: true,
      componentId: uuidv4()

    };
  }

  deCodeLetter() {
    let newCodedIndex = this.state.deCodedIndex + 1;
    if(newCodedIndex < 0) {
      this.setState({ deCodedIndex: 0 });
      this.setState({ dataMessageInEnglish: true });
      clearInterval(this.intervalId);
    } else if(newCodedIndex >= this.props.dataMessage.length) { 
      this.setState({ deCodedIndex: this.props.dataMessage.length });
      this.setState({ dataMessageInEnglish: false });
      clearInterval(this.intervalId);
    } else {
      this.setState({ deCodedIndex: newCodedIndex });
    }
  }

  componentDidMount() {
    this.setState({dataMessage: this.props.dataMessage});
    this.intervalId = setInterval(this.deCodeLetter.bind(this), decodeTimeInMilliseconds);
  }

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.dataMessage !== this.state.dataMessage) {
      clearInterval(this.intervalId);
      this.state.deCodedIndex = 0;
      this.setState({dataMessage: newProps.dataMessage});
      this.intervalId = setInterval(this.deCodeLetter.bind(this), decodeTimeInMilliseconds);
    }
  }
  
	render() {
    let currentMessage = this.props.dataMessage;
    currentMessage = currentMessage.slice(0, 80);
    const deCodedIndex = this.state.deCodedIndex;
    const deCodedMessage = currentMessage.slice(0, deCodedIndex);
    const enCodedMessage = currentMessage.slice(deCodedIndex, currentMessage.length);

    return (
      <div id="data-stream" >
        <div style={DataStreamStyles.ClockStyle}>
          <span style={DataStreamStyles.MessageStyle}>&nbsp;<Clock format={'HH : mm'} ticking={true}/></span>
        </div>
        <div style={DataStreamStyles.DataStreamMessageContainerStyle} >
          <div style={DataStreamStyles.MessageDataStyle}>
            &nbsp;&nbsp;{deCodedMessage}
            <span style={DataStreamStyles.EnCodedeMessageStyle}>{enCodedMessage}</span>
          </div>
        </div>
        <div style={DataStreamStyles.ZoomStyle}>
          <span style={DataStreamStyles.MessageStyle} >&nbsp;&nbsp;&nbsp;Zoom:&nbsp;&nbsp;{this.props.mapCenterAndZoom.zoom - 1}</span>
        </div>
        <div style={DataStreamStyles.CopyrightStyle}>
          <span style={DataStreamStyles.MessageStyle}>&nbsp;&nbsp;{copyRightText}</span>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(DataStream);