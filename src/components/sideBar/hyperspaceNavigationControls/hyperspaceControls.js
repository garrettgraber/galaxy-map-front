import React from 'react';
import { connect } from 'react-redux';
import distance from 'euclidean-distance';
import ReactTooltip from 'react-tooltip';

import '../../../css/main.css';
import {
  setMaxJumps,
  setNumberOfHyperspacePaths,
  emptyHyperspacePathCollections,
  hyperspaceNavigationUpdateOn,
  activeStartPositionDefault,
  activeEndPositionDefault,
  loadingIconOff,
  loadingIconOn,
  addItemToDataStream,
  noNavigationObjectBoundaries
} from '../../../actions/actionCreators.js';
import {
  getHyperspacePathCollection,
  plotFreeSpaceJumpToNode
} from '../../../actions/actions.js';

import PathGenerator from '../../../classes/pathGenerator.js';
import Point from '../../../classes/point.js';
import JumpStatus from '../../../classes/jumpStatus.js';
import EnterHyperspaceIcon from '../../../images/icons/sci-fi-generic/afterburn.svg';

class HyperspaceControls extends React.Component {
  constructor() {
    super();
    this.state = { 
      maxJumps: 30,
      limit: 1,
      jumpButtonClasses: 'navbar-button pulsating-button-off'
    };
  }

  componentDidMount() {
    const CurrentJumpStatus = new JumpStatus({
      startPoint : this.props.hyperspaceStartPoint.system,
      endPoint : this.props.hyperspaceEndPoint.system,
      activeStartPoint : this.props.hyperspaceActiveStartPoint.system,
      activeEndPoint : this.props.hyperspaceActiveEndPoint.system,
      hyperspacePathCollection : this.props.hyperspacePathCollections,
      oldStartPoint : this.props.hyperspaceStartPoint.system,
      oldEndPoint : this.props.hyperspaceEndPoint.system,
      oldPathCollection : this.props.hyperspacePathCollections      
    });
    const jumpButtonClass = CurrentJumpStatus.jumpClassesString();
    this.setState({ jumpButtonClasses: jumpButtonClass });
  }

  componentWillReceiveProps(newProps) {
    const CurrentJumpStatus = new JumpStatus({
      startPoint : newProps.hyperspaceStartPoint.system,
      endPoint : newProps.hyperspaceEndPoint.system,
      activeStartPoint : newProps.hyperspaceActiveStartPoint.system,
      activeEndPoint : newProps.hyperspaceActiveEndPoint.system,
      hyperspacePathCollection : newProps.hyperspacePathCollections,
      oldStartPoint : this.props.hyperspaceStartPoint.system,
      oldEndPoint : this.props.hyperspaceEndPoint.system,
      oldPathCollection : this.props.hyperspacePathCollections
    });
    if(CurrentJumpStatus.newJumpShouldBeCalculated()) {
      const jumpButtonClass = CurrentJumpStatus.jumpClassesString();
      this.setState({ jumpButtonClasses: jumpButtonClass });
    }
  }

  findHyperspacePath() {
    const startSystemExists = this.props.hyperspaceStartSystem.length > 0;
    const endSystemExists = this.props.hyperspaceEndSystem.length > 0;
    if(startSystemExists && endSystemExists) {
      this.setState({ jumpButtonClasses: "navbar-button button-border-teal" });
      const CurentPathGenerator = new PathGenerator(
        this.props.hyperspaceActiveStartPoint,
        this.props.hyperspaceActiveEndPoint,
        this.props.hyperspaceActiveStartNode,
        this.props.hyperspaceActiveEndNode,
        this.props.hyperspaceStartPoint,
        this.props.hyperspaceEndPoint,
        this.props.hyperspaceStartNode,
        this.props.hyperspaceEndNode,
        this.props.activeHyperspaceJump,
        this.props.hyperspaceHash,
        this.state.HyperspaceCollectionsComponents,
        this.props.hyperspacePathCollections,
        this.props.hyperspacePathChange
      );
      if(CurentPathGenerator.shouldAFreeSpaceJumpBePlotted()) {
        this.props.dispatch( plotFreeSpaceJumpToNode(CurentPathGenerator.edgeLocationsSearch()) );
      } else {
        this.props.dispatch(getHyperspacePathCollection(
          CurentPathGenerator.pathSearch(this.state.maxJumps, this.state.limit),
          CurentPathGenerator.edgeLocationsSearch()
        ));
      }
    }
  }

  maxJumpsChange(e) {
    const maxJumps = parseInt(e.target.value);
    if(this.state.limit > 1 && maxJumps > 35) {
      const maxJumpsMessage = "Multi-path jumps can't be calculated over 35 jumps away";
      this.props.dispatch(addItemToDataStream(maxJumpsMessage));
    } else {
      this.setState({maxJumps: maxJumps});
    }
  }

  limitChange(e) {
    const pathNumber = parseInt(e.target.value);
    if(pathNumber > 10) {
      const maxPathsMessage = "Maximum of 10 paths";
      this.props.dispatch(addItemToDataStream(maxPathsMessage));
    } else {
      this.setState({limit: pathNumber});
    }
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
    const JumpButtonStyle = {
      width: 60,
      height: 30,
      padding: 2,
      borderRadius: 2,
      backgroundColor: 'black',
      cursor: 'pointer'
    };
   const EraseButtonStyle = {
      width: 60,
      height: 30,
      padding: 2,
      borderRadius: 2,
      backgroundColor: 'black',
      color: 'red'
    };

    return (
      <div className="pane-row-control pane-section">
        <span className="nav-text">Jumps:&nbsp;&nbsp;</span>
        <input id="max-jumps-input" type="number" min={1} placeholder="Max Jumps" className="search-input number-input" value={this.state.maxJumps}  onChange={(e) => this.maxJumpsChange(e)}/>
        <span className="nav-text">&nbsp;&nbsp;Paths:&nbsp;&nbsp;</span>
        <input id="limit-paths-input" type="number" min={1} placeholder="Limit" className="search-input number-input" value={this.state.limit}  onChange={(e) => this.limitChange(e)}/>
        <img  id="calculate-hyperspace-jump" src={EnterHyperspaceIcon} className={this.state.jumpButtonClasses}  style={JumpButtonStyle} onClick={(e) => this.findHyperspacePath(e)} data-tip="Calculate Hyperspace Jump" data-for="calculate-hyperspace-jump-tooltip" />
        <ReactTooltip id='calculate-hyperspace-jump-tooltip' place="top">{}</ReactTooltip>
        <button  id="reset-hyperspace-jump" className="navbar-button button-border-red"  style={EraseButtonStyle} onClick={(e) => this.clearCurrentHyperspaceJump(e)} data-tip="Reset Hyperspace Jump" data-for="reset-hyperspace-jump-tooltip" >X</button>
        <ReactTooltip id='reset-hyperspace-jump-tooltip' place="top">{}</ReactTooltip>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceControls);