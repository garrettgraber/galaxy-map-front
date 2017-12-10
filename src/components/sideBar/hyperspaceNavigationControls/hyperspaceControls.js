import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import distance from 'euclidean-distance';
import Geohash from 'latlon-geohash';
import ReactTooltip from 'react-tooltip';

import '../../../css/main.css';
import {
  calculateHyperspaceJumpOn,
  setMaxJumps,
  setNumberOfHyperspacePaths,
  emptyHyperspacePathCollections,
  hyperspaceNavigationUpdateOn,
  activeStartPositionDefault,
  activeEndPositionDefault
} from '../../../actions/actionCreators.js';
import {
  getHyperspacePathCollection,
  plotFreeSpaceJumpToNode
} from '../../../actions/actions.js';
import {
  Point,
  PathGenerator
} from '../../../classes/stellarClasses.js';
import AckbarIcon from '../../../images/icons/star-wars/Ackbar.ico';
import OrbitalIcon from '../../../images/icons/sci-fi-generic/orbital.svg';
import GalaxySpiralIcon from '../../../images/icons/sci-fi-generic/twin-shell.svg';
import GalaxyIconOnEdge from '../../../images/icons/randomly-found/galaxy.png';

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

    const startPointsDifferent = ( this.props.hyperspaceStartPoint.system !== this.props.hyperspaceActiveStartPoint.system );
    const endPointsDifferent = (this.props.hyperspaceEndPoint.system  !== this.props.hyperspaceActiveEndPoint.system );
    const activeAndSearchTheSame = (!startPointsDifferent && !endPointsDifferent);


    const jumpButtonClass = getJumpButtonClasses(
      this.props.hyperspaceStartPoint.system,
      this.props.hyperspaceEndPoint.system,
      this.props.hyperspacePathCollections,
      activeAndSearchTheSame
    );
    this.setState({
      jumpButtonClasses: jumpButtonClass
    });
  }


  componentWillReceiveProps(newProps) {

    const startSystemHasChanged = (newProps.hyperspaceStartPoint.system !== this.props.hyperspaceStartPoint.system);
    const endSystemHasChanged = (newProps.hyperspaceEndPoint.system !== this.props.hyperspaceEndPoint.system);
    const hyperspacePathCollectionsHasChanged = (newProps.hyperspacePathCollections !== this.props.hyperspacePathCollections);
    const startPointsDifferent = ( newProps.hyperspaceStartPoint.system !== newProps.hyperspaceActiveStartPoint.system );
    const endPointsDifferent = (newProps.hyperspaceEndPoint.system  !== newProps.hyperspaceActiveEndPoint.system );
    const activeAndSearchTheSame = (!startPointsDifferent && !endPointsDifferent);
    
    if(startSystemHasChanged || endSystemHasChanged || hyperspacePathCollectionsHasChanged || activeAndSearchTheSame) {

      const jumpButtonClass = getJumpButtonClasses(
        newProps.hyperspaceStartPoint.system,
        newProps.hyperspaceEndPoint.system,
        newProps.hyperspacePathCollections,
        activeAndSearchTheSame
      );

      this.setState({
        jumpButtonClasses: jumpButtonClass
      });

    }

  }

  findPath() {

    const startSystemExists = this.props.hyperspaceStartSystem.length > 0;
    const endSystemExists = this.props.hyperspaceEndSystem.length > 0;

    console.log("findPath search: ", this.props);

    if(startSystemExists && endSystemExists) {

      this.setState({
        jumpButtonClasses: "navbar-button button-border-teal"
      });

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
    // this.props.dispatch( setMaxJumps( parseInt(maxJumps) ));
    this.setState({maxJumps: maxJumps});
  }
  limitChange(e) {
    const pathNumber = parseInt(e.target.value);
    // this.props.dispatch(setNumberOfHyperspacePaths( parseInt(pathNumber) ));

    this.setState({limit: pathNumber});
  }
  clearCurrentHyperspaceJump(e) {
    console.log("Ackbar: It's a trap!!  HyperspaceControls this.props: ", this.props);
    this.props.dispatch(emptyHyperspacePathCollections());
    this.props.dispatch(activeStartPositionDefault());
    this.props.dispatch(activeEndPositionDefault());
    this.props.dispatch(hyperspaceNavigationUpdateOn());
  }

  render() {

    const JumpButtonStyle = {
      width: 60,
      height: 30,
      padding: 2,
      borderRadius: 2,
      backgroundColor: 'black'
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
        <span className="nav-text">&nbsp;&nbsp;Limit:&nbsp;&nbsp;</span>
        <input id="limit-paths-input" type="number" min={1} placeholder="Limit" className="search-input number-input" value={this.state.limit}  onChange={(e) => this.limitChange(e)}/>

        <img  id="calculate-hyperspace-jump" src={EnterHyperspaceIcon} className={this.state.jumpButtonClasses}  style={JumpButtonStyle} onClick={(e) => this.findPath(e)} data-tip="Calculate Hyperspace Jump" data-for="calculate-hyperspace-jump-tooltip" />
        <ReactTooltip id='calculate-hyperspace-jump-tooltip' place="top">{}</ReactTooltip>

        <button  id="reset-hyperspace-jump" className="navbar-button button-border-red"  style={EraseButtonStyle} onClick={(e) => this.clearCurrentHyperspaceJump(e)} data-tip="Reset Hyperspace Jump" data-for="reset-hyperspace-jump-tooltip" >X</button>
        <ReactTooltip id='reset-hyperspace-jump-tooltip' place="top">{}</ReactTooltip>

      </div>
    );
  }
}


function getJumpButtonClasses(startSystem, endSystem, hyperspacePathCollections, activeAndSearchTheSame) {

  let jumpClasses = "navbar-button pulsating-button-off";
  if((validHyperspacePoints(startSystem) && validHyperspacePoints(endSystem)) && (hyperspacePathCollections.length === 0 || !activeAndSearchTheSame)) {
    jumpClasses = "navbar-button pulsating-button-ready";
  } else if(hyperspacePathCollections.length > 0 && activeAndSearchTheSame) {
    jumpClasses = "navbar-button button-border-green";
  }  else {
    jumpClasses = "navbar-button pulsating-button-off";
  }
  return jumpClasses;
}


function validHyperspacePoints(systemName) {
  if(systemName === '') {
    return false;
  } else {
    return true;
  }
}


function pointsAreEqual(point1, point2) {
  const sameName = (point1.system === point2.system)? true : false;
  if(sameName) {
    return true;
  } else {
    return false;
  }
}


function distanceBetweenPoints(Point1, Point2) {
  return distance(pointArrayGalactic(Point1), pointArrayGalactic(Point2));
}

function pointArrayGalactic(Point) {
  return [Point.xGalacticLong, Point.yGalacticLong];
}


function findPlanet(systemSearch) {
  const planetQuery = 'api/search/?' + queryString.stringify(systemSearch);
  return fetch(planetQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}


function findHyperspaceNode(nodeSearch) {
  const nodeQuery = '/api/hyperspacenode/search?' + queryString.stringify(nodeSearch);
  return fetch(nodeQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceControls);