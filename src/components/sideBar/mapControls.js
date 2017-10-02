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
  componentDidMount() { 
    console.log("MapControls has Mounted");
  }
  goHome() {
    if(this.props.mapCenterAndZoom.zoom > 2) {
      this.props.dispatch(addItemToDataStream('Moved to Galaxy View...'));
      this.props.dispatch(setMapToZeroZero());
    }
    console.log("goHome has fired: ", this.props);   
  }
  handleUpPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([0, -100]);
      console.log('Panning up');
    }
  }
  handleRightPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([100, 0]);
      console.log('Panning right');
    }
  }
  handleLeftPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([-100, 0]);
      console.log('Panning left');
    }
  }
  handleDownPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {

      console.log('Panning down!!!');

      const mapBoundsBeforeMove = map.getBounds();
      console.log('Map Bounds Before Move: ', mapBoundsBeforeMove);

      let point = L.point(0, 100); // x=0,y=0
      let latlng = map.layerPointToLatLng(point);

      map.panBy(point, {animate: true, duration: 0.25, noMoveStart: true});

      console.log("latlng: ", latlng);

    }
  }
  increaseZoom() {
    console.log("increase zoom");
    this.props.dispatch( increaseMapZoom() );
  }
  decreaseZoom() {
    console.log("decrease zoom");
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