import React from 'react';
import { connect } from 'react-redux';

import JumpPlot from './jumpPlot.js';
import '../../../../css/main.css';
import {
  calculateHyperspaceJumpOn
} from '../../../../actions/actionCreators.js';
import {
  noSetSelectedHyperspaceRoute
} from '../../../../actions/actions.js';

import AckbarIcon from '../../../../images/icons/star-wars/Ackbar.ico';
import OrbitalIcon from '../../../../images/icons/sci-fi-generic/orbital.svg';
import GalaxySpiralIcon from '../../../../images/icons/sci-fi-generic/twin-shell.svg';

class JumpGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 


    };
  }

  componentDidMount() {}

  getJumpPaths() {
    let hyperspacePathData = [];

    if(this.props.hyperspacePathCollections.length > 0) {
      const FirstHyperspaceCollection = this.props.hyperspacePathCollections[0];
      hyperspacePathData = FirstHyperspaceCollection.paths;
      // const foundPaths = getCorrectPath(this.props.hyperspaceStartNode.system, )
    }
    return hyperspacePathData;
  }

  onMouseLeave() {
    console.log("onMouseLeave jump grid!");
    this.props.dispatch(noSetSelectedHyperspaceRoute());
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
      overflow: 'auto',
      border: '1px solid #49fb35',
    };

    const JumpListStyle = {
      height: jumpListHeight,
      border: '1px solid red',
      color:  '#49fb35',
    };

    const JumpGridControllerStyle = {
      color:  '#49fb35',
    };


    return (
      <div >
        <div className="pane-row-control" style={JumpGridControllerStyle}>
          <span className="nav-text">&nbsp;&nbsp;Total Jumps:&nbsp;&nbsp;{jumpPaths.length}</span>
          <span className="nav-text">&nbsp;&nbsp;Active Jump ID:&nbsp;&nbsp;{this.props.activeHyperspaceJump}</span>
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




const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(JumpGrid);