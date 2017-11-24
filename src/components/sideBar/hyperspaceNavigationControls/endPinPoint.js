import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import '../../../css/main.css';
import {  
  pathSearchEndOn,
  pathSearchEndOff,
  pinPointEndToggle,
  pinPointStartOff,
  pathSearchStartOff
} from '../../../actions/actionCreators.js';


class EndPinPoint extends React.Component {
  constructor() {
    super();
    this.state = {
      componentId: uuidv4()
    };
  }
  pinPointEndToggle(e) {
    console.log("\nToggle end");
    const currentEnd = (this.props.pinPointEnd) ? false : true;
    this.props.dispatch(pinPointEndToggle());
    const currentStart = this.switchPinPointStartOff(currentEnd);
    if(currentEnd) {
      this.props.dispatch(pathSearchEndOn());
    } else {
      this.props.dispatch(pathSearchEndOff());
    }
    setCurrsor(currentStart, currentEnd);
  }

  switchPinPointStartOff(endStatus) {
    if(endStatus) {
      this.props.dispatch(pinPointStartOff());
      this.props.dispatch(pathSearchStartOff());
      return false;
    } else {
      return this.props.pinPointStart;
    }
  }

  render() {
    const pinPointIconButtonClass = "glyphicon glyphicon-screenshot";
    const pinPointEnd = (this.props.pinPointEnd)? "btn navbar-button btn-success" : "btn navbar-button btn-danger";

    const EndPoint = this.props.hyperspaceEndPoint;

    return (
      <div className="pane-column">
        <button id="end-path-pinpoint-icon" type="button" className={pinPointEnd}  onClick={(e) => this.pinPointEndToggle(e)} data-tip="Select End Point"
          data-for={'pin-point-hyperspace-end-' + this.state.componentId}  ><i className={pinPointIconButtonClass}></i></button>
        <ReactTooltip id={'pin-point-hyperspace-end-' + this.state.componentId} place="top">{}</ReactTooltip>

        <span className="display-text">&nbsp;&nbsp;{EndPoint.system.slice(0, 10)}</span>
      </div>
    );
  }
}

function setCurrsor(start, end) {
  if(!start && !end) {
    $('.leaflet-container').css('cursor','');
  } else if((start && !end) || (!start && end)) {
      $('.leaflet-container').css('cursor','crosshair');
  } else {
    console.log("Error cannot have both active");
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(EndPinPoint);