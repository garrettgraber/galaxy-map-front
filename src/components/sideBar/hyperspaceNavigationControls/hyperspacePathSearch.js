import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { connect } from 'react-redux';
import distance from 'euclidean-distance';
import { If, Then, Else } from 'react-if';


// import { displaySystems } from '../actions/mapActions.js';
import urlencode from 'urlencode';
import HyperspaceNode from './hyperspaceNode.js';
import HyperspacePoint from './hyperspacePoint.js';
import LatLngDisplay from './latLngDisplay.js';
import StartPinPoint from './startPinPoint.js';
import EndPinPoint from './endPinPoint.js';
import HyperspaceControls from './hyperspaceControls.js';
import HyperspaceShipDetails from './hyperspaceShipDetails.js';
import JumpGrid from './jumpGrid/jumpGrid.js';
import ReactTable from 'react-table';
import ReactScrollTable from 'react-scroll-table';




import { Point } from '../../../classes/stellarClasses.js';

import {
  getHyperspacePathCollection,
  hyperspacePositionSearch
} from '../../../actions/actions.js';
import '../../../css/main.css';
import 'react-table/react-table.css';
import {
  addHyperspacePathToCollection,
  stopUpdatingHyperspacePath,
  errorHyperspacePath,
  pathSearchStartOn,
  pathSearchStartOff,
  pathSearchEndOn,
  pathSearchEndOff,
  pinPointStartOn,
  pinPointStartOff,
  pinPointStartToggle,
  pinPointEndOn,
  pinPointEndOff,
  pinPointEndToggle,
  setStartSystem,
  setEndSystem,
  calculateHyperspaceJumpOn
} from '../../../actions/actionCreators.js';
import AckbarIcon from '../../../images/icons/star-wars/Ackbar.ico';
import OrbitalIcon from '../../../images/icons/sci-fi-generic/orbital.svg';
import GalaxySpiralIcon from '../../../images/icons/sci-fi-generic/twin-shell.svg';


class HyperspacePathSearch extends React.Component {
  constructor() {
    super();
    this.state = { 
      start: 'Tatooine',
      end: 'Herdessa',
      searchSystemsStart: true,
      searchSystemsEnd: true
    };
  }
  componentDidMount() { } 
  switchSearchStart() {
    this.setState({searchSystemsStart: !this.state.searchSystemsStart});
  }
  switchSearchEnd() {
    this.setState({searchSystemsEnd: !this.state.searchSystemsEnd});
  }
  startChange(e) {
    const startInput = e.target.value;
    // this.props.dispatch(setStartSystem(startInput));
    const StartSearch = {system: startInput, isStartPosition: true};
    console.log("StartSearch: ", StartSearch.system);
    this.setState({start: StartSearch.system});
    this.props.dispatch(hyperspacePositionSearch(StartSearch));
  } 
  endChange(e) {
    const endInput = e.target.value;
    // this.props.dispatch(setEndSystem(endInput));
    const EndSearch = {system: endInput, isStartPosition: false};
    console.log("EndSearch: ", EndSearch.system);
    this.setState({end: EndSearch.system});
    this.props.dispatch(hyperspacePositionSearch(EndSearch));
  }
  searchStart() {
    const StartSearch = {system: this.state.start, isStartPosition: true};
    // this.setState({start: StartSearch.system});
    // this.props.dispatch(setStartSystem(StartSearch.system));
    this.props.dispatch(hyperspacePositionSearch(StartSearch));
  }
  searchEnd() {
    const EndSearch = {system: this.state.end, isStartPosition: false};
    // this.props.dispatch(setEndSystem(EndSearch.system));
    // this.setState({end: EndSearch.system});
    this.props.dispatch(hyperspacePositionSearch(EndSearch));
  }
  render() {

    const searchSystemsStart = (this.state.searchSystemsStart)? "btn navbar-button btn-success" :  "btn navbar-button btn-danger" ;
    const searchSystemsEnd = (this.state.searchSystemsEnd)? "btn navbar-button btn-success" :  "btn navbar-button btn-danger" ;
    const startNode =  this.props.hyperspaceStartNode;
    const endNode =  this.props.hyperspaceEndNode;

    // console.log("pathSearch: ", this.props.pathSearchStart);
    // console.log("this.props in HyperspacePathSearch: ", this.props);
    // console.log("this.state in HyperspacePathSearch: ", this.state);
    // console.log("rendering HyperspacePathSearch");

    let hyperspacePathData = [];

    if(this.props.hyperspacePathCollections.length > 0) {
      const FirstHyperspaceCollection = this.props.hyperspacePathCollections[0];
      hyperspacePathData = FirstHyperspaceCollection.paths;
      // const foundPaths = getCorrectPath(this.props.hyperspaceStartNode.system, )
    }


    console.log("hyperspacePathData: ", hyperspacePathData);


    return (
      <div id="hyperspace-navigation-pane" className="control-row">
        <HyperspaceShipDetails />
        <HyperspaceControls />
        <div className="pane-section">
          <div className="pane-row-control">
            <span className="nav-text">Start&nbsp;&nbsp;</span>
            <button id="point-jump-icon" type="button" className={searchSystemsStart} onClick={(e) => this.switchSearchStart(e)} ><i className={"fa fa-globe"}></i></button>
            {
              (this.state.searchSystemsStart) ? (<div className="pane-column">
                  <span className="nav-text">System:&nbsp;&nbsp;</span>
                  <input id="start-system-input" type="text" placeholder="Start System" className="search-input" value={this.state.start} onChange={(e) => this.startChange(e)} />
                  <button type="button" className="btn navbar-button btn-primary"  onClick={(e) => this.searchStart(e)} ><i className="glyphicon glyphicon-search"></i></button>
                </div>
              ) : ( <StartPinPoint/> )
            }
          </div>
          <HyperspacePoint Point={this.props.hyperspaceStartPoint} />
          <HyperspaceNode Node={startNode}/>
        </div>

        <div className="pane-section">
          <div className="pane-row-control">
            <span className="nav-text">End&nbsp;&nbsp;</span>
            <button id="point-jump-icon" type="button" className={searchSystemsEnd} onClick={(e) => this.switchSearchEnd(e)} ><i className={"fa fa-globe"}></i></button>
            {
              (this.state.searchSystemsEnd) ? (<div className="pane-column">
                  <span className="nav-text">System:&nbsp;&nbsp;</span>
                  <input id="start-system-input" type="text" placeholder="End System" className="search-input" value={this.state.end} onChange={(e) => this.endChange(e)} />
                  <button type="button" className="btn navbar-button btn-primary"  onClick={(e) => this.searchEnd(e)} ><i className="glyphicon glyphicon-search"></i></button>
                </div>
              ) : ( <EndPinPoint/> )
            }
          </div>
          <HyperspacePoint Point={this.props.hyperspaceEndPoint} />
          <HyperspaceNode Node={endNode}/>         
        </div>

        
        <If condition={ hyperspacePathData.length > 0 }>
          <Then>
            <JumpGrid />
          </Then>
          <Else>{() => null }</Else>
        </If>

      </div>
    );
  }
}

// <ReactTable showPagination={false} data={hyperspacePathData} columns={columns}/>

function getCorrectPath(startNode, endNode, pathsArray) {
  return _.filter(pathsArray, function(path) { 
    return (path.start === startNode && path.end === endNode); 
  });
}

function setCurrsor(start, end) {
  if(!start && !end) {
    $('.leaflet-container').css('cursor','');
  } else if((start && !end) || (!start && end)) {
      $('.leaflet-container').css('cursor','crosshair');
  } else {
    console.log("Error cannot have both active");
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};
export default connect(mapStateToProps)(HyperspacePathSearch);
