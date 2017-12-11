import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import HyperspaceNode from './hyperspaceNode.js';
import HyperspacePoint from './hyperspacePoint.js';
import HyperspaceLocation from './hyperspaceLocation.js';
import PinPoint from './pinPoint.js';



import NavigationSystemSearch from './navigationSystemSearch.js';
import '../../../css/main.css';
import {
  setMapCenterAndZoom,
  pinPointStartOff,
  pinPointEndOff,

  pathStartClickOff,
  pathEndClickOff

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
    if(!_.isEmpty(this.props.Point)) {
      const Point = this.props.Point;
      const spaceCoordinates = [Point.lat, Point.lng];
      this.props.dispatch(zoomToLocation(spaceCoordinates, 8));
    }    
  }
  switchSearchType() {
    const searchSystemsNewValue = !this.state.searchSystems;
    this.setState({searchSystems: searchSystemsNewValue});

    // console.log("\nsearchSystemsNewValue: ", searchSystemsNewValue);
    // console.log("isStartPosition: ", this.props.isStartPosition);
    // console.log("pinPoint: ", this.props.pinPoint);
    // console.log("pinPointAlternate: ", this.props.pinPointAlternate);
    // console.log("clickSystem: ", this.props.clickSystem);
    // console.log("clickSystem Alternate: ", this.props.clickSystemAlternate);

    if(this.props.isStartPosition) {
      this.props.dispatch(pinPointStartOff());
      this.props.dispatch(pathStartClickOff());
    } else {
      this.props.dispatch(pinPointEndOff());
      this.props.dispatch(pathEndClickOff());
    }

    if(searchSystemsNewValue) {
      if(this.props.pinPoint && !this.props.pinPointAlternate) {
        $('.leaflet-container').css('cursor','');
      }
    } else {
      if(this.props.clickSystem && !this.props.clickSystemAlternate) {
        $('.leaflet-container').css('cursor','');
      }
    }
  }

  render() {
    const searchSystems = (this.state.searchSystems)? "btn hyperspace-navigation-button btn-success" :  "btn hyperspace-navigation-button btn-danger" ;
    const pointZoom = (this.props.Point.system)? "btn hyperspace-navigation-button btn-success" : "btn hyperspace-navigation-button btn-primary";

    return (
      <div className="pane-section">
        <div className="pane-row-control">
          <div className="nav-text" style={{width: 40, display: "inline-block", verticalAlign: "top"}}>{this.props.pointName.slice(0, 8)}&nbsp;</div>
          <button id="point-jump-icon" type="button" className={searchSystems} style={{verticalAlign: "top"}}  onClick={(e) => this.switchSearchType(e)}   data-tip="Search by System" data-for={'search-by-system-' + this.state.componentId}><i className={"fa fa-globe"}></i></button>
          <ReactTooltip id={'search-by-system-' + this.state.componentId} place="top">{}</ReactTooltip>

          <button type="button" className={pointZoom} style={{verticalAlign: "top"}} onClick={(e) => this.zoomToPoint(e)}   data-tip="Zoom To System" data-for={'go-to-star-system-' + this.state.componentId}><i className={"fa fa-bullseye"}  ></i></button>
          <ReactTooltip id={'go-to-star-system-' + this.state.componentId} place="top">{}</ReactTooltip>

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