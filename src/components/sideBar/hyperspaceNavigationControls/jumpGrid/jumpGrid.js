import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import JumpPlot from './jumpPlot.js';
import {
  nodeAndPointAreEqual,
  distanceBetweenPoints
} from '../../../hyperspaceNavigation/hyperspaceMethods.js';

import {
  noSetSelectedHyperspaceRoute
} from '../../../../actions/actions.js';

import {
  emptyHyperspacePathCollections,
  hyperspaceNavigationUpdateOn,
  activeStartPositionDefault,
  activeEndPositionDefault,
  activeStartNodeDefault,
  activeEndNodeDefault,
  noNavigationObjectBoundaries
} from '../../../../actions/actionCreators.js';

import '../../../../css/main.css';

class JumpGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentId: uuidv4(),
      freeSpaceDistance: 0
    }
  }

  componentDidMount() {
    const StartPoint = this.props.hyperspaceStartPoint;
    const StartNode = this.props.hyperspaceStartNode;
    const EndPoint = this.props.hyperspaceEndPoint;
    const EndNode = this.props.hyperspaceEndNode;
    const distanceBetweenStartNodeAndPoint = distanceBetweenPoints(StartPoint, StartNode);
    const distanceBetweenEndNodeAndPoint = distanceBetweenPoints(EndPoint, EndNode);
    const freeSpaceDistance = distanceBetweenStartNodeAndPoint + distanceBetweenEndNodeAndPoint;
    this.setState({freeSpaceDistance: freeSpaceDistance});
    this.refs.zoomPathButton.focus();
  }

  getJumpPaths() {
    let hyperspacePathData = [];
    if(this.props.hyperspacePathCollections.length > 0) {
      const FirstHyperspaceCollection = this.props.hyperspacePathCollections[0];
      hyperspacePathData = FirstHyperspaceCollection.paths;
    }
    return hyperspacePathData;
  }

  onMouseLeave() {
    this.props.dispatch(noSetSelectedHyperspaceRoute());
  }

  zoomToHyperspacePath() {
    const map = this.props.map;
    map.fitBounds(this.props.navigationObjectBoundaries);
    const newBounds = map.getBounds();
    this.refs.zoomPathButton.blur();
    const mapIsAtGalaxyView = mapAtGalaxyView(newBounds);
  }

  clearCurrentHyperspaceJump(e) {
    this.props.dispatch(emptyHyperspacePathCollections());
    this.props.dispatch(activeStartPositionDefault());
    this.props.dispatch(activeStartNodeDefault());
    this.props.dispatch(activeEndNodeDefault());
    this.props.dispatch(activeEndPositionDefault());
    this.props.dispatch(noNavigationObjectBoundaries());
    this.props.dispatch(hyperspaceNavigationUpdateOn());
  }

  componentWillReceiveProps(newProps) {
    const StartPoint = newProps.hyperspaceStartPoint;
    const StartNode = newProps.hyperspaceStartNode;
    const EndPoint = newProps.hyperspaceEndPoint;
    const EndNode = newProps.hyperspaceEndNode;
    const distanceBetweenStartNodeAndPoint = distanceBetweenPoints(StartPoint, StartNode);
    const distanceBetweenEndNodeAndPoint = distanceBetweenPoints(EndPoint, EndNode);
    const freeSpaceDistance = distanceBetweenStartNodeAndPoint + distanceBetweenEndNodeAndPoint;
    this.setState({freeSpaceDistance: freeSpaceDistance});
    const ActiveStartPoint = newProps.hyperspaceActiveStartPoint;
    const ActiveEndPoint = newProps.hyperspaceActiveEndPoint;
    const OldActiveStartPoint = this.props.hyperspaceActiveStartPoint;
    const OldActiveEndPoint = this.props.hyperspaceActiveEndPoint;
    const startPointHasChanged = !nodeAndPointAreEqual(ActiveStartPoint, OldActiveStartPoint);
    const endPointHasChanged = !nodeAndPointAreEqual(ActiveEndPoint, OldActiveEndPoint);
    if(startPointHasChanged || endPointHasChanged) {
      this.refs.zoomPathButton.focus();
    }
  }

  render() {
    const jumpPlotHeight = 50;
    const jumpPaths = this.getJumpPaths();
    const jumpListHeight = jumpPaths.length * jumpPlotHeight;
    const containerDiv1Styles = {
      height: 51,
      position: 'relative',
    };
    const containerDiv2Styles = {
      maxHeight:'100%',
      border: '1px solid #49fb35',
    };
    if(jumpPaths.length > 4) {
      containerDiv2Styles['overflowY'] = 'scroll';
    } else {
      containerDiv2Styles['overflowY'] = 'hidden';
    }
    const JumpListStyle = {
      height: jumpListHeight,
      border: '1px solid red',
      color:  '#49fb35',
    };
    const JumpGridControllerStyle = {
      color:  '#49fb35',
    };
    const StartAndEndStyles = {
      height: 30,
      color:  '#49fb35',
      verticalAlign: "top",
      paddingTop: 4,
      paddingBottom: 4
    };
    const activeStartSystem = this.props.hyperspaceActiveStartPoint.system;
    const acttveEndSystem = this.props.hyperspaceActiveEndPoint.system;
    const zoomToPathClasses = "btn hyperspace-navigation-button btn-success";

    return (
      <div className="pane-container">
        <div className="pane-section">
          <div className="hyperspace-controls-pane-row" style={JumpGridControllerStyle}>
            <button
              type="button"
              className={zoomToPathClasses}
              style={{verticalAlign: "top", width: 40}}
              onClick={(e) => this.zoomToHyperspacePath(e)}
              data-tip="Zoom to Path"
              data-for={'zoom-hyperspace-navigation-click' + this.state.componentId}
              ref="zoomPathButton"
            >
              <i className="fa fa-bullseye"></i>
            </button>
            <ReactTooltip id={'zoom-hyperspace-navigation-click' + this.state.componentId} place="top" disable={this.props.mobileStatus}>{}</ReactTooltip>
            <div className="pane-column">
              <span className="nav-text">&nbsp;&nbsp;Total Paths:&nbsp;&nbsp;{jumpPaths.length}</span>
            </div>
            <button  id="reset-hyperspace-jump" className="btn hyperspace-navigation-button btn-danger pull-right" style={{width: 40}} onClick={(e) => this.clearCurrentHyperspaceJump(e)} data-tip="Reset Hyperspace Jump" data-for="reset-hyperspace-jump-tooltip-foo" ref="resetJump">
              <i className="fa fa-close"></i>
            </button>
            <ReactTooltip id='reset-hyperspace-jump-tooltip-foo' place="top" disable={this.props.mobileStatus}>{}</ReactTooltip>
          </div>
          <div style={StartAndEndStyles}>
            &nbsp;Start:&nbsp;{this.props.hyperspaceActiveStartPoint.system}
          </div>
          <div style={StartAndEndStyles}>
            &nbsp;End&nbsp;:&nbsp;{this.props.hyperspaceActiveEndPoint.system}
          </div>
        </div>
        <div id="div1" style={containerDiv1Styles}>
          <div id="div2" style={containerDiv2Styles} >
            <div id="div3"  style={JumpListStyle} onMouseLeave={(e) => this.onMouseLeave(e)} >
              { generateGridRowPaths(this.getJumpPaths(), this.state.freeSpaceDistance) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function generateGridRowPaths(pathsArray, freeSpaceDistance) {
  let masterJumpPlotsArray = [];
  if(pathsArray.length > 0) {
    const singleJump = (pathsArray.length === 1)? true : false;
    for(let i=0; i < pathsArray.length; i++) {
      const Path = pathsArray[i];
      masterJumpPlotsArray.push(<JumpPlot key={Path.hashValue} PathObject={Path} singleJump={singleJump} freeSpaceDistance={freeSpaceDistance} />);
    }
  } else {
    const jumpHashVaule = uuidv4();
    const PathObject = {
      hashValue: jumpHashVaule,
      numberOfJumps: 1,
      length: 0
    };
    masterJumpPlotsArray.push(<JumpPlot key={PathObject.hashValue} PathObject={PathObject} singleJump={true} freeSpaceDistance={freeSpaceDistance} />);
  }
  return masterJumpPlotsArray;
}

function emptySpaceCheck(system) {
  if(system.includes('@')) {
    const splitSystem = system.split('@');
    const emptySpaceHash = splitSystem[1];
    const emptySpaceName = "ES " + emptySpaceHash.slice(0, 10);
    return emptySpaceName;
  } else {
    return system;
  }
}

function mapAtGalaxyView(mapBounds) {
  const aboveIsGalaxyViewLat = 80.0;
  const aboveIsGalaxyViewLng = 180.0;
  const northEastLatIsGalaxy = mapBounds._northEast.lat > aboveIsGalaxyViewLat;
  const northEastLngIsGalaxy = mapBounds._northEast.lng > aboveIsGalaxyViewLng;
  const southWestLatIsGalaxy = mapBounds._southWest.lat < -aboveIsGalaxyViewLat;
  const southWestLngIsGalaxy = mapBounds._southWest.lng < -aboveIsGalaxyViewLng;
  const northEastIsGalaxyLevel = northEastLatIsGalaxy && northEastLngIsGalaxy;
  const southWestIsGalaxyLevel = southWestLatIsGalaxy && southWestLngIsGalaxy;
  if(northEastIsGalaxyLevel && southWestIsGalaxyLevel) {
    return true;
  }else {
    return false;
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(JumpGrid);