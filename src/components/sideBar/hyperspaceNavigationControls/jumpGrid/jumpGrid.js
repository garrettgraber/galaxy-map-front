import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import JumpPlot from './jumpPlot.js';

import {
  noSetSelectedHyperspaceRoute
} from '../../../../actions/actions.js';

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

  render() {
    const jumpPlotHeight = 50;
    const jumpPaths = this.getJumpPaths();
    const jumpListHeight = jumpPaths.length * jumpPlotHeight;
    const containerDiv1Styles = {
      height: 200,
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
    const activeStartSystem = this.props.hyperspaceActiveStartPoint.system;
    const acttveEndSystem = this.props.hyperspaceActiveEndPoint.system;

    const zoomToPathClasses = "btn hyperspace-navigation-button btn-success pull-right";


    return (
      <div >
        <div className="pane-row-control" style={JumpGridControllerStyle}>
          <span className="nav-text">&nbsp;&nbsp;Total Paths:&nbsp;&nbsp;{jumpPaths.length}</span>
          <button
            type="button"
            className={zoomToPathClasses}
            style={{verticalAlign: "top"}}
            onClick={(e) => this.zoomToHyperspacePath(e)}
            data-tip="Zoom to Path"
            data-for={'zoom-hyperspace-navigation-click' + this.state.componentId}
          >
            <i className="fa fa-sun-o"></i>
          </button>
          <ReactTooltip id={'zoom-hyperspace-navigation-click' + this.state.componentId} place="right">{}</ReactTooltip>
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