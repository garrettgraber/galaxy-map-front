import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import '../../../css/main.css';
import {
  pathSearchStartOn,
  pathSearchStartOff,
  pathSearchEndOn,
  pathSearchEndOff,
  pinPointStartOn,
  pinPointStartOff,
  pinPointEndOn,
  pinPointEndOff,
  pathStartClickOff,
  pathEndClickOff,
  defaultCursor,
  crosshairCursor,
} from '../../../actions/actionCreators.js';


class PinPoint extends React.Component {
  constructor() {
    super();
    this.state = {
      componentId: uuidv4()
    };
  }

  componentDidMount() {
    this.setCurrsorAsCrosshairs(this.props.pinPoint);
  }

  componentWillReceiveProps(newProps) {
    this.setCurrsorAsCrosshairs(newProps.pinPoint);
  }

  setCurrsorAsCrosshairs(crosshairStatus) {
    if(crosshairStatus) {
      this.props.dispatch(crosshairCursor());
    }
  }

  pinPointToggle(e) {
    if(!this.props.pinPoint) {
      if(this.props.isStartPosition) {
        this.props.dispatch(pathStartClickOff());    
        this.props.dispatch(pathEndClickOff());
        this.props.dispatch(pinPointEndOff());
        this.props.dispatch(pathSearchEndOff());
        this.props.dispatch(pathSearchStartOn());
        this.props.dispatch(pinPointStartOn());
      } else {
        this.props.dispatch(pathStartClickOff());    
        this.props.dispatch(pathEndClickOff());
        this.props.dispatch(pinPointStartOff());
        this.props.dispatch(pathSearchStartOff());
        this.props.dispatch(pathSearchEndOn());
        this.props.dispatch(pinPointEndOn());
      }
    } else {
      if(this.props.isStartPosition) {
        this.props.dispatch(pinPointStartOff());
        this.props.dispatch(pathSearchStartOff());
      } else {
        this.props.dispatch(pinPointEndOff());
        this.props.dispatch(pathSearchEndOff());
      }
      this.props.dispatch(defaultCursor());
    }
  }

  render() {
    const pinPointIconButtonClass = "glyphicon glyphicon-screenshot";
    const buttonTooltip = (this.props.isStartPosition) ? "Select Start Point" : "Select End Point";
    const pinPointClasses = (this.props.pinPoint)? "btn hyperspace-navigation-button btn-success" :  "btn hyperspace-navigation-button btn-danger" ;
    return (
      <div className="pane-column">
        <button
          type="button"
          className={pinPointClasses}
          onClick={(e) => this.pinPointToggle(e)}
          data-tip={buttonTooltip}
          data-for={'pin-point-hyperspace-' + this.state.componentId}
        >
          <i className={pinPointIconButtonClass}></i>
        </button>
        <ReactTooltip id={'pin-point-hyperspace-' + this.state.componentId} place="top">{}</ReactTooltip>

        <span className="display-text">&nbsp;&nbsp;{this.props.Point.system}</span>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(PinPoint);