import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON, CircleMarker, Popup, Circle, Tooltip, Marker, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import 'whatwg-fetch';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';
import distance from 'euclidean-distance';
import Geohash from 'latlon-geohash';



// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';

import HyperspaceData from 'json-loader!../../data/hyperspace.geojson';
import HyperspacePathCollection from './hyperspacePathCollection.js';
import HyperspaceNavigationPoint from './hyperspaceNavigationPoint.js';
import { createFreespaceLane, nodeAndPointAreEqual } from './hyperspaceMethods.js';

import {
  addHyperspacePathToCollection,
  updateHyperspacePaths,
  stopUpdatingHyperspacePath,
  errorHyperspacePath,
  hyperspaceNavigationUpdateOff
} from '../../actions/actionCreators.js';
import {
  getHyperspacePathCollection
} from '../../actions/actions.js';


class HyperspaceNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspaceCollectionsComponents: [],
      HSpaceComponentsMaster: []
    };
  }
  componentDidMount() { }
  componentWillReceiveProps(newProps) {

    console.log("\n\nHyperspace Navigation newProps.update: ", newProps.update);
    console.log("\n\n");
    
    if(newProps.update) {

      console.log("\nnewProps in Hyperspace Navigation: ", newProps);
      console.log("HyperspaceNavigation this.props: ", this.props);

      const StartPoint = this.props.hyperspaceStartPoint;
      const EndPoint = this.props.hyperspaceEndPoint;
      const StartNode = this.props.hyperspaceStartNode;
      const EndNode = this.props.hyperspaceEndNode;
      const ActiveStartPoint = this.props.hyperspaceActiveStartPoint;
      const ActiveEndPoint = this.props.hyperspaceActiveEndPoint;

      const ActiveStartNode = this.props.hyperspaceActiveStartNode;
      const ActiveEndNode = this.props.hyperspaceActiveEndNode;

      let navComponentsRendered = [];

      if(newProps.hyperspacePathChange) {

        if(this.props.hyperspacePathCollections.length > 0) {

          const EdgeLocationsLiteral = {
            StartPoint: ActiveStartPoint,
            EndPoint: ActiveEndPoint,
            StartNode: ActiveStartNode,
            EndNode: ActiveEndNode
          };

          const EdgeLocations = _.cloneDeep(EdgeLocationsLiteral);
          const activeHyperspaceJump = newProps.activeHyperspaceJump !== null;
          const selectedHyperspaceJump  = newProps.hyperspaceHash !== null;
          const activeJumpNoGridSelection = activeHyperspaceJump && !selectedHyperspaceJump;
          let hyperspaceHash = null;

          if(activeJumpNoGridSelection) {
            hyperspaceHash = newProps.activeHyperspaceJump;
          } else if(selectedHyperspaceJump) {
            hyperspaceHash = newProps.hyperspaceHash;
          }

          const HSpaceCollectionsComponents = createCollectionsComponents(this.props.hyperspacePathCollections, EdgeLocations, hyperspaceHash);
          navComponentsRendered.push(HSpaceCollectionsComponents);

          this.setState({HyperspaceCollectionsComponents: HSpaceCollectionsComponents});

        } else if(StartNode.nodeId === EndNode.nodeId) {

          console.log("Generating free space jump, hoooaaa");

          if(!nodeAndPointAreEqual(StartPoint, StartNode)) {
            const PointToNodeJumpComponentStart = createFreespaceLane(StartNode, StartPoint, true);
            navComponentsRendered.push(PointToNodeJumpComponentStart);
          }
          if(!nodeAndPointAreEqual(EndPoint, EndNode)) {
            const PointToNodeJumpComponentEnd = createFreespaceLane(EndNode, EndPoint, false);
            navComponentsRendered.push(PointToNodeJumpComponentEnd);
          }

        } else {
          const HyperspaceCollectionsClone = _.cloneDeep(this.state.HyperspaceCollectionsComponents);
          navComponentsRendered.push(HyperspaceCollectionsClone);
        }

        this.props.dispatch(stopUpdatingHyperspacePath());

      } else if(this.props.hyperspacePathCollections.length > 0) {

        const HyperspaceCollectionsClone = _.cloneDeep(this.state.HyperspaceCollectionsComponents);
        navComponentsRendered.push(HyperspaceCollectionsClone);

      }

      const hyperspacePointsArray = [
        {
          Point: StartPoint,
          isStart: true,
          isActive: false
        },
        {
          Point: EndPoint,
          isStart: false,
          isActive: false
        },
        {
          Point: ActiveStartPoint,
          isStart: true,
          isActive: true
        },
        {
          Point: ActiveEndPoint,
          isStart: false,
          isActive: true
        },
      ];

      navComponentsRendered = generateHyperspaceNavigationPoints(hyperspacePointsArray, navComponentsRendered);

      this.setState({HSpaceComponentsMaster: navComponentsRendered});
      this.props.dispatch(hyperspaceNavigationUpdateOff());
    }
  }

  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
  	const zIndex = 260;
    const navComponents = renderComponentsOrNull(this.state.HSpaceComponentsMaster);

  	return (
  		<Pane name="hyperspace-navigation-pane" style={{ zIndex: zIndex }}>
        <FeatureGroup> 
          { navComponents }
        </FeatureGroup>
  		</Pane>
  	)
  }
}


function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}


// function mergeComponenets(component1, component2) {
//   let resultingComponents = [];
//   const componentsArray = [component1, component2];
//   for(let component of componentsArray) {
//     resultingComponents = addComponent(component, resultingComponents);
//   }
//   return resultingComponents;
// }


// function addComponent(Component, resultsArray) {
//   if(Array.isArray(Component)) {
//     const mergedArray = _.merge(Component, resultsArray);
//     return mergedArray;
//   } else if(Component !== null) {
//     resultsArray.push(Component);
//     return resultsArray;
//   } else {
//     return resultsArray;
//   }
// }


function generateHyperspaceNavigationPoints(pointsArray, hyperspaceArray) {
  for(let PointValues of pointsArray) {
    hyperspaceArray = addPointToHyperspaceArray(PointValues.Point, PointValues.isStart, PointValues.isActive, hyperspaceArray);
  }
  return hyperspaceArray;
}


function addPointToHyperspaceArray(Point, isStart, isActive, hyperspaceArray) {
  if(pointIsValid(Point)) {
    hyperspaceArray.push(<HyperspaceNavigationPoint key={uuidv4()} HyperSpacePoint={Point} isStart={isStart} isActive={isActive} />);
  }
  return hyperspaceArray;
}


function pointIsValid(Point) {
  const pointStatus = (Point.lat && Point.lng)? true : false;
  return pointStatus;
}


function renderNewHyperspacePaths(EdgeLocations, activeHyperspaceJumpValue, hyperspaceHashSelectedValue, hyperspacePathCollections) {

  console.log("Rendering new hyperspace path!");

  let navComponentsRendered = [];

  const activeHyperspaceJump = activeHyperspaceJumpValue !== null;
  const selectedHyperspaceJump  = hyperspaceHashSelectedValue !== null;
  const activeJumpNoGridSelection = activeHyperspaceJump && !selectedHyperspaceJump;
  let hyperspaceHash = null;

  if(activeJumpNoGridSelection) {
    hyperspaceHash = activeHyperspaceJumpValue;
  } else if(selectedHyperspaceJump) {
    hyperspaceHash = hyperspaceHashSelectedValue;
  }


  const HSpaceCollectionsComponents = createCollectionsComponents(hyperspacePathCollections, EdgeLocations, hyperspaceHash);
  console.log("HSpaceCollectionsComponents: ", HSpaceCollectionsComponents);
  
  navComponentsRendered = HSpaceCollectionsComponents;
  const startNavigationComponent = NavigationPointComponent(StartPoint, true);
  navComponentsRendered.push(startNavigationComponent);
  const endNavigationComponent = NavigationPointComponent(EndPoint, false);
  navComponentsRendered.push(endNavigationComponent);

  return navComponentsRendered;
}


function createCollectionsComponents(PathCollections, EdgeLocations, hyperspaceHash) {
  console.log("\n\n!!!Creat hyperspace paths Components has fired: ", PathCollections.length);
  const PathCollectionsComponentsArray = [];
  for(let PathCollection of PathCollections) {
    PathCollectionsComponentsArray.push(<HyperspacePathCollection key={uuidv4()} PathCollection={PathCollection} EdgeLocations={EdgeLocations} hyperspaceHashDisplayed={hyperspaceHash} />);
  }
  return PathCollectionsComponentsArray;
}


function NavigationPointComponent(HyperSpacePoint, isStart) {
  console.log("rendering NavigationPointComponent HyperSpacePoint: ", HyperSpacePoint);
  const hyperspacePointLocation = [HyperSpacePoint.lat, HyperSpacePoint.lng];
  const LocationColorCyan = '#87CEFA';
  const LocationColor = (isStart)? '#49fb35' : '#ff0101';
  return (<div key={HyperSpacePoint.system + ":" + uuidv4()}>
      <CircleMarker center={hyperspacePointLocation} radius={1} color={'orange'}/>
      <CircleMarker className="pulse" center={hyperspacePointLocation} radius={6} color={LocationColor}/>
    </div>);
}


function getPathDataShortest(start, end, maxJumps) {
  return fetch('/api/hyperspace-jump/calc-shortest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start: start,
      end: end,
      maxJumps: maxJumps
    })
  });
}

function getPathDataMany(start, end, maxJumps, limit) {
  return fetch('/api/hyperspace-jump/calc-many', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start: start,
      end: end,
      maxJumps: maxJumps,
      limit: limit
    })
  });
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceNavigation);