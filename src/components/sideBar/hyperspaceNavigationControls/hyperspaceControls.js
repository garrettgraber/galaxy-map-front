import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { If, Then, Else } from 'react-if';

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
  noNavigationObjectBoundaries,
  setDefaultStartPosition,
  setDefaultStartNode,
  setDefaultEndPosition,
  setDefaultEndNode,
  emptyStartSystem,
  emptyEndSystem
} from '../../../actions/actionCreators.js';
import {
  getHyperspacePathCollection,
  plotFreeSpaceJumpToNode,
  jumpShipToDestination
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
      jumpButtonClasses: 'hyperspace-navigation-button pulsating-button-off',
      singleJump: true,
      multiplePathsEnabled: false,
      jumpStatusMessage: '',
      jumpCompletionStatus: false
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
    const jumpStatusMessage = CurrentJumpStatus.statusMessageString();
    const jumpCompletionStatus = CurrentJumpStatus.statusIsComplete();
    this.setState({ jumpStatusMessage: jumpStatusMessage });
    this.setState({ jumpButtonClasses: jumpButtonClass });
    this.setState({ jumpCompletionStatus: jumpCompletionStatus });
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
    const jumpStatusMessage = CurrentJumpStatus.statusMessageString();
    this.setState({ jumpStatusMessage: jumpStatusMessage });
    const jumpCompletionStatus = CurrentJumpStatus.statusIsComplete();
    this.setState({ jumpCompletionStatus: jumpCompletionStatus });


    if(CurrentJumpStatus.newJumpShouldBeCalculated()) {
      const jumpButtonClass = CurrentJumpStatus.jumpClassesString();
      this.setState({ jumpButtonClasses: jumpButtonClass });
    }
    if(CurrentJumpStatus.startPointAndEndPointEqual()) {
      // console.log('Cannot jump to the same place');
    }
    if(CurrentJumpStatus.jumpCanCalculate()) {
      this.refs.calculateJump.focus();
    }
    const activeElement = document.activeElement;
    const jumpButtonIsActive = activeElement.isEqualNode(this.refs.calculateJump);
    if(!CurrentJumpStatus.jumpCanCalculate() && jumpButtonIsActive) {
      this.refs.calculateJump.blur();
    }
  }

  findHyperspacePath() {
    const startSystemExists = this.props.hyperspaceStartSystem.length > 0;
    const endSystemExists = this.props.hyperspaceEndSystem.length > 0;
    const jumpReady = this.state.jumpStatusMessage === 'Jump Ready to be Calculated';
    if(startSystemExists && endSystemExists && jumpReady) {
      this.setState({ jumpButtonClasses: "hyperspace-navigation-button  button-border-teal" });
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

  initateHyperspaceJump() {
    if(this.state.jumpCompletionStatus) {
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
    
      this.props.dispatch(jumpShipToDestination(
        CurentPathGenerator.pathSearch(this.state.maxJumps, this.state.limit),
        CurentPathGenerator.edgeLocationsSearch()
      ));

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
      const singleJumpStatus = (pathNumber <= 1)? true : false;
      this.setState({singleJump: singleJumpStatus});
    }
  }

  clearCurrentHyperspaceJumpSearch(e) {
    this.refs.resetJump.blur();
    this.props.dispatch(setDefaultStartPosition());
    this.props.dispatch(setDefaultEndPosition());
    this.props.dispatch(hyperspaceNavigationUpdateOn());
    this.props.dispatch(setDefaultStartNode());
    this.props.dispatch(setDefaultEndNode());
    this.props.dispatch(emptyStartSystem());
    this.props.dispatch(emptyEndSystem());
  }

  singleJumpToggle(e) {
    this.refs.jumpToggle.blur();
    if(this.state.multiplePathsEnabled) {
      const currentJumpIsSingular = this.state.singleJump;
      const newSingleJumpStatus = !currentJumpIsSingular;
      (newSingleJumpStatus)? this.setState({limit: 1}) : this.setState({limit: 2});
      this.setState({singleJump: newSingleJumpStatus});
    }
  }

  handleKeyPress(e) {
    if(e.key == 'Enter'){ this.findHyperspacePath(e) }
  }

  render() {
    const JumpButtonStyle = {
      width: 40,
      height: 36,
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
    const singleJumpToggleClasses = (this.state.singleJump)? "btn hyperspace-navigation-button btn-success" : "btn hyperspace-navigation-button btn-warning";
    const jumpTypeTooltip = (this.state.singleJump)? "Calculating Single Path" : "Calculating Multiple Path";

    return (
      <div className="hyperspace-controls-pane-row pane-section">
        <img
          id="calculate-hyperspace-jump"
          src={EnterHyperspaceIcon}
          className={this.state.jumpButtonClasses}
          style={JumpButtonStyle}
          onClick={(e) => this.findHyperspacePath(e)}
          data-tip="Calculate Jump"
          data-for="calculate-hyperspace-jump-tooltip"
          ref="calculateJump"
          tabIndex="0"
          onKeyPress={(e) => this.handleKeyPress(e)}
        />
        <ReactTooltip id='calculate-hyperspace-jump-tooltip' place="top" disable={this.props.mobileStatus}>{}</ReactTooltip>
        <button
          type="button"
          className={singleJumpToggleClasses}
          style={{verticalAlign: "top", width: 40, display: 'none'}}
          onClick={(e) => this.singleJumpToggle(e)}
          data-tip={jumpTypeTooltip}
          data-for={'multi-jump-toggle' + this.state.componentId}
          ref="jumpToggle"
        >
          <If condition={ this.state.singleJump }>
            <Then><i className="fa fa-arrow-right"></i></Then>
            <Else><i className="fa fa-arrows"></i></Else>
          </If>
        </button>
        <ReactTooltip id={'multi-jump-toggle' + this.state.componentId} place="top" disable={this.props.mobileStatus}>{}</ReactTooltip>
        <If condition={ this.state.singleJump }>
          <Then>
            <span className="nav-text">&nbsp;&nbsp;{this.state.jumpStatusMessage}&nbsp;&nbsp;</span>
          </Then>
          <Else>
            <span>
              <span className="nav-text">&nbsp;&nbsp;Jumps:&nbsp;&nbsp;</span>
              <input id="max-jumps-input" type="number" min={1} placeholder="Max Jumps" className="search-input number-input" value={this.state.maxJumps}  onChange={(e) => this.maxJumpsChange(e)}/>
              <span className="nav-text">&nbsp;&nbsp;Paths:&nbsp;&nbsp;</span>
              <input id="limit-paths-input" type="number" min={1} placeholder="Limit" className="search-input number-input" value={this.state.limit}  onChange={(e) => this.limitChange(e)}/>
            </span>
          </Else>
        </If>









        <button  id="reset-hyperspace-jump-search" className="btn hyperspace-navigation-button btn-danger pull-right" style={{width: 40}} onClick={(e) => this.clearCurrentHyperspaceJumpSearch(e)} data-tip="Reset Start & End Points" data-for="reset-hyperspace-jump-search-tooltip" ref="resetJump" >
          <i className="fa fa-close"></i>
        </button>
        <ReactTooltip id='reset-hyperspace-jump-search-tooltip' place="top"  disable={this.props.mobileStatus}>{}</ReactTooltip>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceControls);