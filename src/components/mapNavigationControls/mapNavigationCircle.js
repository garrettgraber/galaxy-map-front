import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import '../../css/main.css';
import {
  setMapToZeroZero,
  addItemToDataStream,
  increaseMapZoom,
  decreaseMapZoom,
  loadingIconOff
} from '../../actions/actionCreators.js';

import * as MapCircleStyles from './mapCircleStyles.js';
import GalaxyIconOnEdge from '../../images/icons/randomly-found/galaxy.png';

class MapNavigationCircle extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() { }
  goHome() {
    if(this.props.mapCenterAndZoom.zoom > 2) {
      this.refs.galaxyButton.blur();
      this.props.dispatch(addItemToDataStream('Moved to Galaxy View...'));
      this.props.dispatch(setMapToZeroZero());
      this.props.dispatch(loadingIconOff());
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
      map.panBy(point, {animate: true, duration: 0.25, noMoveStart: true});
    }
  }
  increaseZoom() {
    this.refs.increaseZoom.blur();
    this.props.dispatch( increaseMapZoom() );
  }
  decreaseZoom() {
    this.refs.decreaseZoom.blur();
    this.props.dispatch( decreaseMapZoom() );
  }
  
	render() {
    const bottomBase = this.props.bottomBase;

    return (
      <div  id="circle-container"  style={MapCircleStyles.MapControlsContainerStyle}>
        <div id="zoom-button-container" style={MapCircleStyles.ZoomContainerStyle}>
          <div id="zoom-button-decrease" style={MapCircleStyles.ZoomButtonContainerStyle}>
            <button
              type="button"
              className="btn btn-primary"
              style={MapCircleStyles.ZoomDecreaseButtonStyle}
              onClick={(e) => this.decreaseZoom(e)}
              data-tip="Zoom Out"
              data-for="zoom-out-toggle-navigation"
              ref="decreaseZoom"
            >
              <i className="fa fa-minus-circle"></i>
            </button>
            <ReactTooltip id='zoom-out-toggle-navigation' place="top">{}</ReactTooltip>
          </div>
          <div id="zoom-button-increase" style={MapCircleStyles.ZoomButtonContainerStyle}>
            <button
              type="button"
              className="btn btn-primary"
              style={MapCircleStyles.ZoomIncreaseButtonStyle}
              onClick={(e) => this.increaseZoom(e)}
              data-tip="Zoom In"
              data-for="zoom-in-toggle-navigation"
              ref="increaseZoom"
            >
              <i className="fa fa-plus-circle"></i>
            </button>
            <ReactTooltip id='zoom-in-toggle-navigation' place="top">{}</ReactTooltip>
          </div>          
        </div>
        <div  id="map-pan-buttons"  style={MapCircleStyles.MapPanButtonsContainerStyle}>
          <div id="circle" className="rotate-circle" style={MapCircleStyles.CircleStyle}>
            <div id="q1"  style={MapCircleStyles.PanQuarterStyle} onClick={e => this.handleUpPanClick(e)}>
              <i className="fa fa-angle-double-left" style={MapCircleStyles.HandleUpPanStyle}></i>
            </div>
            <div id="q2" style={MapCircleStyles.PanQuarterStyle} onClick={e => this.handleRightPanClick(e)}  data-tip="Pan Right" data-for="pan-right-navigation-toggle" ><i className="fa fa-angle-double-up"  style={MapCircleStyles.HandleRightPanStyle}></i>
            </div>
            <div id="q3" style={MapCircleStyles.PanQuarterStyle} onClick={e => this.handleLeftPanClick(e)} data-tip="Pan Left" data-for="pan-left-navigation-toggle"><i className="fa fa-angle-double-down" style={MapCircleStyles.HandleLeftPanStyle}></i>
            </div>
            <div id="q4"  style={MapCircleStyles.PanQuarterStyle} onClick={e => this.handleDownPanClick(e)}><i className="fa fa-angle-double-right" style={MapCircleStyles.HandleDownPanStyle}></i>
            </div>
          </div>
        </div>
        <div id="galaxy-home-button" style={MapCircleStyles.GalaxyHomeButtonContainerStyle}>
          <button
            style={MapCircleStyles.GalaxyHomeButtonStyle}
            onClick={e => this.goHome(e)}
            data-tip="Galaxy View"
            data-for="galaxy-view-toggle-navigation"
            ref="galaxyButton"
            >
            <img id="galaxy-view-toggle-navigation-image" style={MapCircleStyles.GalaxyImageStyle} src={GalaxyIconOnEdge}/>
          </button>
          <ReactTooltip id='galaxy-view-toggle-navigation' place="top">{}</ReactTooltip>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(MapNavigationCircle);