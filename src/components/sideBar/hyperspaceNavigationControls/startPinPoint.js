import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import LatLngDisplay from './latLngDisplay.js';

import '../../../css/main.css';
import {
  pathSearchStartOn,
  pathSearchStartOff,
  pathSearchEndOff,
  pinPointStartToggle,
  pinPointEndOff
} from '../../../actions/actionCreators.js';


class StartPinPoint extends React.Component {
  constructor() {
    super();
    this.state = {
      componentId: uuidv4()
    };
  }

  componentDidMount() { }

  pinPointStartToggle(e) {
    console.log("\nToggle start");
    const currentStart = (this.props.pinPointStart) ? false : true;
    this.props.dispatch(pinPointStartToggle());
    const currentEnd = this.switchPinPointEndOff(currentStart);
    if(currentStart) {
      this.props.dispatch(pathSearchStartOn());
    } else {
      this.props.dispatch(pathSearchStartOff());
    }
    setCurrsor(currentStart, currentEnd);
  }

  switchPinPointEndOff(startStatus) {
    if(startStatus) {
      this.props.dispatch(pinPointEndOff());
      this.props.dispatch(pathSearchEndOff());
      return false;
    } else {
      return this.props.pinPointEnd;
    }
  }

  render() {
    const pinPointIconButtonClass = "glyphicon glyphicon-screenshot";
    const pinPointStart = (this.props.pinPointStart)? "btn navbar-button btn-success" :  "btn navbar-button btn-danger" ;
    const StartPoint = this.props.hyperspaceStartPoint;

    return (
      <div className="pane-column">
        <button id="start-path-pinpoint-icon" type="button" className={pinPointStart}  onClick={(e) => this.pinPointStartToggle(e)} data-tip="Select Start Point"
          data-for={'pin-point-hyperspace-start-' + this.state.componentId} ><i className={pinPointIconButtonClass}></i></button>
        <ReactTooltip id={'pin-point-hyperspace-start-' + this.state.componentId} place="top">{}</ReactTooltip>

        <span className="display-text">&nbsp;&nbsp;{StartPoint.system}</span>
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

// export default StartPinPoint;
export default connect(mapStateToProps)(StartPinPoint);
