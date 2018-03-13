import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import '../../css/main.css';
import {
  setMapToZeroZero,
  addItemToDataStream,
  increaseMapZoom,
  decreaseMapZoom
} from '../../actions/actionCreators.js';

class MapControls extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {}
  goHome() {
    if(this.props.mapCenterAndZoom.zoom > 2) {
      this.props.dispatch(addItemToDataStream('Moved to Galaxy View...'));
      this.props.dispatch(setMapToZeroZero());
    }
  }
  handleUpPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([0, -100]);
    }
  }
  handleRightPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([100, 0]);
    }
  }
  handleLeftPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([-100, 0]);
    }
  }
  handleDownPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      const mapBoundsBeforeMove = map.getBounds();
      let point = L.point(0, 100); // x=0,y=0
      let latlng = map.layerPointToLatLng(point);
      map.panBy(point, {animate: true, duration: 0.25, noMoveStart: true});
    }
  }
  increaseZoom() {
    this.props.dispatch( increaseMapZoom() );
  }
  decreaseZoom() {
    this.props.dispatch( decreaseMapZoom() );
  }
  
	render() {
    return (
      <div className="control-row nav-section">
        <span >
          <button
            id="home-button-icon"
            type="button"
            className="btn btn-primary navbar-button"
            onClick={e => this.goHome(e)}
            data-tip="Galaxy View"
            data-for="galaxy-view-toggle"            
          >
            <i className="glyphicon glyphicon-home"></i>
          </button>
          <ReactTooltip id='galaxy-view-toggle' place="right">{}</ReactTooltip>

          <button
            className="btn btn-primary navbar-button"
            onClick={e => this.handleLeftPanClick(e)}
            data-tip="Pan Left"
            data-for="pan-left-toggle"
          >
            Left
          </button>
          <ReactTooltip id='pan-left-toggle' place="right">{}</ReactTooltip>
          <button
            className="btn btn-primary navbar-button"
            onClick={e => this.handleRightPanClick(e)}
            data-tip="Pan Right"
            data-for="pan-right-toggle"
          >
            Right
          </button>
          <ReactTooltip id='pan-right-toggle' place="right">{}</ReactTooltip>
          <button
            className="btn btn-primary navbar-button"
            onClick={e => this.handleUpPanClick(e)}
            data-tip="Pan Up"
            data-for="pan-up-toggle"
          >
            Up
          </button>
          <ReactTooltip id='pan-up-toggle' place="right">{}</ReactTooltip>

          <button
            className="btn btn-primary navbar-button"
            onClick={e => this.handleDownPanClick(e)}
            data-tip="Pan Down"
            data-for="pan-down-toggle"
          >
            Down
          </button>
          <ReactTooltip id='pan-down-toggle' place="right">{}</ReactTooltip>

          <button
            className="btn btn-primary navbar-button"
            onClick={e => this.increaseZoom(e)}
            data-tip="Zoom In"
            data-for="zoom-in-toggle"
          >
            +
          </button>
          <ReactTooltip id='zoom-in-toggle' place="right">{}</ReactTooltip>

          <button
            className="btn btn-primary navbar-button"
            onClick={e => this.decreaseZoom(e)}
            data-tip="Zoom Out"
            data-for="zoom-out-toggle"
          >
            -
          </button>
          <ReactTooltip id='zoom-out-toggle' place="right">{}</ReactTooltip>

        </span>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(MapControls);