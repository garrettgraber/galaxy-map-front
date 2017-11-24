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
  setNumberOfHyperspacePaths
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

class HyperspaceControls extends React.Component {
  constructor() {
    super();
    this.state = { 
      maxJumps: 30,
      limit: 5,
    };
  }
  findPath() {

    const startSystemExists = this.props.hyperspaceStartSystem.length > 0;
    const endSystemExists = this.props.hyperspaceEndSystem.length > 0;

    if(startSystemExists && endSystemExists) {

      this.props.dispatch( calculateHyperspaceJumpOn() );
 
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
  itsATrap(e) {
    console.log("Ackbar: It's a trap!!  HyperspaceControls this.props: ", this.props);
  }

  render() {
    const iconButtonClass = (this.props.calculateHyperspaceJump)? "fa fa-cog fa-spin" : "fa fa-space-shuttle";
    const buttonClass = (this.props.calculateHyperspaceJump)? "btn navbar-button btn-success" :  "btn navbar-button btn-primary" ;

    return (
      <div className="pane-row-control pane-section">
        <span className="nav-text">Jumps:&nbsp;&nbsp;</span>
        <input id="max-jumps-input" type="number" placeholder="Max Jumps" className="search-input number-input" value={this.state.maxJumps}  onChange={(e) => this.maxJumpsChange(e)}/>
        <span className="nav-text">&nbsp;&nbsp;Limit:&nbsp;&nbsp;</span>
        <input id="limit-paths-input" type="number" placeholder="Limit" className="search-input number-input" value={this.state.limit}  onChange={(e) => this.limitChange(e)}/>
        <button
          id="find-path-icon"
          type="button"
          className={buttonClass}
          onClick={(e) => this.findPath(e)}
          data-tip="Calculate Hyperspace Jump"
          data-for="calculate-hyperspace-jump-tooltip"
        >
          <i className={iconButtonClass}></i>
        </button>
        <ReactTooltip id='calculate-hyperspace-jump-tooltip' place="top">{}</ReactTooltip>

        <img  id="its-a-trap" className=" navbar-button"  src={GalaxySpiralIcon} style={{width: "30px", height:"30px", padding: "2px", borderRadius: "2px", border: "1px solid #49fb35"}} onClick={(e) => this.itsATrap(e)} data-tip="It's a Trap!" data-for="a-trap-tooltip" />
        <ReactTooltip id='a-trap-tooltip' place="top">{}</ReactTooltip>

      </div>
    );
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