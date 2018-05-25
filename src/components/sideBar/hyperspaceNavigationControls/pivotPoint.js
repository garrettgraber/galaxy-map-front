import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import HyperspacePoint from './hyperspacePoint.js';
import HyperspaceLocation from './hyperspaceLocation.js';
import PinPoint from './pinPoint.js';
import NavigationSystemSearch from './navigationSystemSearch.js';

import '../../../css/main.css';
import {
  pinPointStartOff,
  pinPointEndOff,
  pathStartClickOff,
  pathEndClickOff,
  defaultCursor,
  zoomToAndPanIsOn,
  setMapCenterAndZoom
} from '../../../actions/actionCreators.js';
import {
  zoomToLocation
} from '../../../actions/actions.js';


class PivotPoint extends React.Component {
  constructor() {
    super();
    this.state = { 
      searchSystems: true,
      componentId: uuidv4()
    };
  }
  componentDidMount() { }
  zoomToPoint() {
    this.refs.zoomPoint.blur();
    if(!_.isEmpty(this.props.Point)) {
      const newZoom = 8;
      const Point = this.props.Point;
      const spaceCoordinates = [Point.lat, Point.lng];
      const map = this.props.map;
      map.flyTo(spaceCoordinates, newZoom, {animate: false});
      if(this.props.mobileStatus) {
        this.props.dispatch(zoomToAndPanIsOn());
      }
    }    
  }
  switchSearchType() {
    this.refs.switchSearchType.blur();
    const searchSystemsNewValue = !this.state.searchSystems;
    this.setState({searchSystems: searchSystemsNewValue});
    if(this.props.isStartPosition) {
      this.props.dispatch(pinPointStartOff());
      this.props.dispatch(pathStartClickOff());
    } else {
      this.props.dispatch(pinPointEndOff());
      this.props.dispatch(pathEndClickOff());
    }
    if(searchSystemsNewValue) {
      if(this.props.pinPoint && !this.props.pinPointAlternate) {
        this.props.dispatch(defaultCursor());
      }
    } else {
      if(this.props.clickSystem && !this.props.clickSystemAlternate) {
        this.props.dispatch(defaultCursor());
      }
    }
  }

  render() {
    const searchSystems = (this.state.searchSystems)? "btn hyperspace-navigation-button btn-success" :  "btn hyperspace-navigation-button btn-danger" ;
    const pointZoom = (this.props.Point.system)? "btn hyperspace-navigation-button btn-success" : "btn hyperspace-navigation-button btn-primary";

    return (
      <div className="pane-section">
        <div className="pane-row-control">
          <div className="pane-column" style={{float: 'left'}}>
            <div className="nav-text" style={{width: 40, display: "inline-block", verticalAlign: "top"}}>{this.props.pointName.slice(0, 8)}&nbsp;</div>
            <button id="point-jump-icon" type="button" className={searchSystems} style={{verticalAlign: "top"}}  onClick={(e) => this.switchSearchType(e)}   data-tip="Search by System" data-for={'search-by-system-' + this.state.componentId} ref="switchSearchType"><i className={"fa fa-globe"}></i></button>
            <ReactTooltip id={'search-by-system-' + this.state.componentId} place="top"  disable={this.props.mobileStatus}>{}</ReactTooltip>
            <button type="button" className={pointZoom} style={{verticalAlign: "top"}} onClick={(e) => this.zoomToPoint(e)}   data-tip="Zoom To System" data-for={'go-to-star-system-' + this.state.componentId} ref="zoomPoint"><i className={"fa fa-bullseye"}  ></i></button>
            <ReactTooltip id={'go-to-star-system-' + this.state.componentId} place="top" disable={this.props.mobileStatus}>{}</ReactTooltip>
          </div>
          <If condition={ this.state.searchSystems }>
            <Then>
              <NavigationSystemSearch isStartPosition={this.props.isStartPosition} pointName={this.props.pointName} system={this.props.Point.system} clickSystem={this.props.clickSystem}  />
            </Then>
            <Else>
              <PinPoint isStartPosition={this.props.isStartPosition} Point={this.props.Point} pinPoint={this.props.pinPoint} />
            </Else>
          </If>
        </div>
        <HyperspaceLocation Point={this.props.Point} />
        <HyperspacePoint Point={this.props.Point} />
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(PivotPoint);