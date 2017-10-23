import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import distance from 'euclidean-distance';
import Geohash from 'latlon-geohash';
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
import { Point } from '../../../classes/stellarClasses.js';
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
    console.log("findPath has been hit!! ", this.props);
    if(this.props.hyperspaceStartSystem.length > 0 && this.props.hyperspaceEndSystem.length > 0) {
      this.props.dispatch( calculateHyperspaceJumpOn() );
      console.log("this.state in HyperspacePathSearch: ", this.state);

      const PathSearch = {
        maxJumps: parseInt(this.state.maxJumps),
        limit: parseInt(this.state.limit),
        start: this.props.hyperspaceStartNode.system,
        end: this.props.hyperspaceEndNode.system,
        startPoint: this.props.hyperspaceStartPoint.system,
        endPoint: this.props.hyperspaceEndPoint.system,
      };

      const PathData = {
        StartPoint: _.cloneDeep(this.props.hyperspaceStartPoint),
        EndPoint: _.cloneDeep(this.props.hyperspaceEndPoint),
        StartNode: _.cloneDeep(this.props.hyperspaceStartNode),
        EndNode: _.cloneDeep(this.props.hyperspaceEndNode),
      };

      // console.log("PathSearch: ", PathSearch);

      // PathSearch.maxJumps = parseInt(PathSearch.maxJumps);
      // PathSearch.limit = parseInt(PathSearch.limit);
      // const isShortestPath = (PathSearch.limit > 1) ? false : true;
      PathSearch.shortest = (PathSearch.limit > 1) ? false : true;
      // PathSearch.shortest = isShortestPath;

      console.log("PathData.StartNode: ", PathData.StartNode);
      console.log("PathData.EndNode: ", PathData.EndNode);


      if(PathData.StartNode.nodeId === PathData.EndNode.nodeId) {

        console.log("Start and End Nodes are the same, calculate free space jump(s)..");

        this.props.dispatch( plotFreeSpaceJumpToNode(PathData) );

      } else {

        this.props.dispatch( getHyperspacePathCollection(PathSearch, PathData) );

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

    // const StartPoint = new Point(
    //   this.props.hyperspaceStartPoint.system,
    //   this.props.hyperspaceStartPoint.lat,
    //   this.props.hyperspaceStartPoint.lng
    // );

    // const StartNode = new Point(
    //   this.props.hyperspaceStartNode.system,
    //   this.props.hyperspaceStartNode.lat,
    //   this.props.hyperspaceStartNode.lng
    // );

    // const EndPoint = new Point(
    //   this.props.hyperspaceEndPoint.system,
    //   this.props.hyperspaceEndPoint.lat,
    //   this.props.hyperspaceEndPoint.lng
    // );

    // const EndNode = new Point(
    //   this.props.hyperspaceEndNode.system,
    //   this.props.hyperspaceEndNode.lat,
    //   this.props.hyperspaceEndNode.lng
    // );

    // console.log("StartPoint: ", StartPoint);
    // console.log("StartNode: ", StartNode);
    // console.log("EndPoint: ", EndPoint);
    // console.log("EndNode: ", EndNode);

   // distanceBetweenPoints(EndPoint, EndNode);
    // distanceBetweenPoints(StartNode, EndNode);
    // distanceBetweenPoints(StartPoint, EndPoint);




    const currentActiveStartPoint = this.props.hyperspaceActiveStartPoint;
    const currentActiveEndPoint = this.props.hyperspaceActiveEndPoint;
    const currentActiveStartNode = this.props.hyperspaceActiveStartNode;
    const currentActiveEndNode =  this.props.hyperspaceActiveEndNode;


    const currentStartPoint = this.props.hyperspaceStartPoint;
    const currentEndPoint = this.props.hyperspaceEndPoint;
    const currentStartNode = this.props.hyperspaceStartNode;
    const currentEndNode =  this.props.hyperspaceEndNode;


    console.log("currentActiveStartPoint: ", currentActiveStartPoint);
    console.log("currentActiveEndPoint: ", currentActiveEndPoint);
    console.log("currentActiveStartNode: ", currentActiveStartNode);
    console.log("currentActiveEndNode: ", currentActiveEndNode);


    console.log("currentStartPoint: ", currentActiveStartPoint);
    console.log("currentEndPoint: ", currentActiveEndPoint);
    console.log("currentStartNode: ", currentActiveStartNode);
    console.log("currentEndNode: ", currentActiveEndNode);

    const activeStartPoint = [currentActiveStartPoint.xGalacticLong, currentActiveStartPoint.yGalacticLong];

    const activeStartNode = [currentActiveStartNode.xGalacticLong, currentActiveStartNode.yGalacticLong];

    console.log("activeStartPoint: ", activeStartPoint);
    console.log("activeStartNode: ", activeStartNode);


    const distanceStartPointToNode = distance(
      [currentActiveStartPoint.xGalacticLong, currentActiveStartPoint.yGalacticLong],
      [currentActiveStartNode.xGalacticLong, currentActiveStartNode.yGalacticLong]
    );



    const distanceEndPointToNode = distance(
      [currentActiveEndPoint.xGalacticLong, currentActiveEndPoint.yGalacticLong],
      [currentActiveEndNode.xGalacticLong, currentActiveEndNode.yGalacticLong]
    );

    const distanceStartToEndPoint = distance(
      [currentActiveStartPoint.xGalacticLong, currentActiveStartPoint.yGalacticLong],
      [currentActiveEndPoint.xGalacticLong, currentActiveEndPoint.yGalacticLong]
    );


    console.log("Distance Start Point To Node", distanceStartPointToNode);
    console.log("Distance End Point To Node", distanceEndPointToNode);
    console.log("Distance Start Point To End Point", distanceStartToEndPoint);

 



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
        <button id="find-path-icon" type="button" className={buttonClass}  onClick={(e) => this.findPath(e)} ><i className={iconButtonClass}></i></button>
        <img  id="its-a-trap" className=" navbar-button"  src={GalaxySpiralIcon} style={{width: "30px", height:"30px", padding: "2px", borderRadius: "2px", border: "1px solid #49fb35"}} onClick={(e) => this.itsATrap(e)} />
      </div>
    );
  }
}


function distanceBetweenPoints(Point1, Point2) {
  const distanceBetween = distance(Point1.coordinates(), Point2.coordinates());
  const distanceBetweenNormalized = distance(Point1.coordinatesNormalized(), Point2.coordinatesNormalized());
  console.log("Point1: ", Point1.system);
  console.log("Point2: ", Point2.system);
  console.log("distanceBetween: ", distanceBetween);
  console.log("distanceBetweenNormalized: ", distanceBetweenNormalized);
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