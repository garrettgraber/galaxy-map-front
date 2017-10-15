import React from 'react';
import { connect } from 'react-redux';
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
  componentDidMount() { 
    console.log("MapControls has Mounted");
  }
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
          <button id="home-button-icon" type="button" className="btn btn-primary navbar-button"  onClick={e => this.goHome(e)} ><i className="glyphicon glyphicon-home"></i></button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleLeftPanClick(e)}>
              Left
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleRightPanClick(e)}>
              Right
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleUpPanClick(e)}>
              Up
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleDownPanClick(e)}>
              Down
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.increaseZoom(e)}>
              +
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.decreaseZoom(e)}>
              -
            </button>
        </span>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(MapControls);