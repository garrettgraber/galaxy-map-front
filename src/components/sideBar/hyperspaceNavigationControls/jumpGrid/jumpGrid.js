import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import JumpPlot from './jumpPlot.js';

import {
  noSetSelectedHyperspaceRoute
} from '../../../../actions/actions.js';

import {
  emptyHyperspacePathCollections,
  hyperspaceNavigationUpdateOn,
  activeStartPositionDefault,
  activeEndPositionDefault,
  noNavigationObjectBoundaries
} from '../../../../actions/actionCreators.js';

import '../../../../css/main.css';

class JumpGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentId: uuidv4()
    }
  }

  componentDidMount() { }

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
    console.log("Zoom to Hyperspace Path");
    const map = this.props.map;
    map.fitBounds(this.props.navigationObjectBoundaries);
  }

  clearCurrentHyperspaceJump(e) {
    console.log("Ackbar: It's a trap!!  HyperspaceControls this.props: ", this.props);
    this.props.dispatch(emptyHyperspacePathCollections());
    this.props.dispatch(activeStartPositionDefault());
    this.props.dispatch(activeEndPositionDefault());
    this.props.dispatch(noNavigationObjectBoundaries());
    this.props.dispatch(hyperspaceNavigationUpdateOn());
  }

  render() {
    const jumpPlotHeight = 50;
    const jumpPaths = this.getJumpPaths();
    const jumpListHeight = jumpPaths.length * jumpPlotHeight;
    const containerDiv1Styles = {
      height: 108,
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
            >
              <i className="fa fa-bullseye"></i>
            </button>
            <ReactTooltip id={'zoom-hyperspace-navigation-click' + this.state.componentId} place="top">{}</ReactTooltip>

            <div className="pane-column">
              <span className="nav-text">&nbsp;&nbsp;Total Paths:&nbsp;&nbsp;{jumpPaths.length}</span>
            </div>
            <button  id="reset-hyperspace-jump" className="btn hyperspace-navigation-button btn-danger pull-right" style={{width: 40}} onClick={(e) => this.clearCurrentHyperspaceJump(e)} data-tip="Reset Hyperspace Jump" data-for="reset-hyperspace-jump-tooltip-foo" >
              <i className="fa fa-close"></i>
            </button>
            <ReactTooltip id='reset-hyperspace-jump-tooltip-foo' place="top">{}</ReactTooltip>
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
              { generateGridRowPaths(this.getJumpPaths()) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function generateGridRowPaths(pathsArray) {
  let masterJumpPlotsArray = [];
  for(let i=0; i < pathsArray.length; i++) {
    const Path = pathsArray[i];
    masterJumpPlotsArray.push(<JumpPlot key={Path.hashValue} PathObject={Path} />);
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

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(JumpGrid);