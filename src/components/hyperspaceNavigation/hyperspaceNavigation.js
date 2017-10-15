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
      let navComponentsRendered = [];


      console.log("\n\nValid points: ");
      console.log("StartPoint: ", pointIsValid(StartPoint));
      console.log("EndPoint: ", pointIsValid(EndPoint));
      console.log("StartNode: ", pointIsValid(StartNode));
      console.log("EndNode: ", pointIsValid(EndNode));
      console.log("\n\n");

      if(this.props.hyperspacePathCollections.length > 0) {

        if(newProps.hyperspacePathChange) {

          console.log("Pepsi! Rendering new hyperspace path!");
          console.log("Pepsi! hyperspaceActiveStartPoint: ", this.props.hyperspaceActiveStartPoint);
          console.log("Pepsi! hyperspaceActiveEndPoint: ", this.props.hyperspaceActiveEndPoint);


          const EdgeLocationsLiteral = {
            StartPoint: StartPoint,
            EndPoint: EndPoint,
            StartNode: StartNode,
            EndNode: EndNode
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

          // console.log("hyperspaceHash foo: ", hyperspaceHash);
          // console.log("newProps.hyperspaceHash foo: ", newProps.hyperspaceHash);
          // console.log("newProps.activeHyperspaceJump foo: ", newProps.activeHyperspaceJump);
          // console.log("Hyperspace hash: ", hyperspaceHash);

          const HSpaceCollectionsComponents = createCollectionsComponents(this.props.hyperspacePathCollections, EdgeLocations, hyperspaceHash);
          // console.log("HSpaceCollectionsComponents: ", HSpaceCollectionsComponents);
          
          const startNavigationComponent = NavigationPointComponent(StartPoint, true);
          HSpaceCollectionsComponents.push(startNavigationComponent);
          const endNavigationComponent = NavigationPointComponent(EndPoint, false);
          HSpaceCollectionsComponents.push(endNavigationComponent);

          navComponentsRendered = HSpaceCollectionsComponents;


          this.setState({HyperspaceCollectionsComponents: HSpaceCollectionsComponents});
          this.props.dispatch(stopUpdatingHyperspacePath());

        } else {
          navComponentsRendered = _.cloneDeep(this.state.HyperspaceCollectionsComponents);

          console.log("\n\nPepsi! Not Rendering new hyperspace paths!");
          console.log("Pepsi! StartPoint: ", this.props.hyperspaceStartPoint);
          console.log("Pepsi! EndPoint: ", this.props.hyperspaceEndPoint);
          console.log("Pepsi! hyperspaceActiveStartPoint: ", this.props.hyperspaceActiveStartPoint);
          console.log("Pepsi! hyperspaceActiveEndPoint: ", this.props.hyperspaceActiveEndPoint);

          const ActiveStartPoint = this.props.hyperspaceActiveStartPoint;
          const ActiveEndPoint = this.props.hyperspaceActiveEndPoint;
          const StartPointsEqual = _.isEqual(ActiveStartPoint, StartPoint);
          const EndPointsEqual = _.isEqual(ActiveEndPoint, EndPoint);

          console.log("Pepsi! Start Points not equal: ", !StartPointsEqual);
          

          if(!StartPointsEqual) {
            const startNavigationComponent = NavigationPointComponent(StartPoint, true);
            navComponentsRendered.push(startNavigationComponent);
            console.log("Pepsi! Start Point Added: ", StartPoint);
          }

          if(!EndPointsEqual) {
            const endNavigationComponent = NavigationPointComponent(EndPoint, false);
            navComponentsRendered.push(endNavigationComponent);
            console.log("Pepsi! End Point Added: ", EndPoint);
          }

        }

        const FirstHyperspacePath = this.props.hyperspacePathCollections[0];

        if(FirstHyperspacePath.start !== StartNode.nodeId) {
          console.log("Pepsi! Start Node and Path Start Not the Same!");
          const startNavigationComponent = NavigationPointComponent(StartPoint, true);
          navComponentsRendered.push(startNavigationComponent);
        }

        if(FirstHyperspacePath.end !== EndNode.nodeId) {
          console.log("Pepsi! End Node and Path End Not the Same!");
          const endNavigationComponent = NavigationPointComponent(EndPoint, false);
          navComponentsRendered.push(endNavigationComponent);
        }

        // if(pointIsValid(StartPoint)) {
        //   console.log("Pepsi! Start Point is valid and rendering");
        //   const startNavigationComponent = NavigationPointComponent(StartPoint, true);
        //   navComponentsRendered.push(startNavigationComponent);
        // }

        // if(pointIsValid(EndPoint)) {
        //   console.log("Pepsi! End Point is valid and rendering");
        //   const endNavigationComponent = NavigationPointComponent(EndPoint, false);
        //   navComponentsRendered.push(endNavigationComponent);
        // }

      } else {

        const noPathChangeAndStartIsValid = !newProps.hyperspacePathChange && pointIsValid(StartPoint);
        const noPathChangeAndEndIsValid = !newProps.hyperspacePathChange && pointIsValid(EndPoint);

        if(noPathChangeAndStartIsValid) {
          console.log("Pepsi! No Path change and Start Point is valid and rendering");

          const startNavigationComponent = NavigationPointComponent(StartPoint, true);
          navComponentsRendered.push(startNavigationComponent);
        }

        if(noPathChangeAndEndIsValid) {

          console.log("Pepsi! No Path change and End Point is valid and rendering");

          const endNavigationComponent = NavigationPointComponent(EndPoint, false);
          navComponentsRendered.push(endNavigationComponent);
        }

      }

      console.log("navComponentsRendered rendered array length: ", navComponentsRendered.length);
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

  // console.log("hyperspaceHash foo: ", hyperspaceHash);
  // console.log("newProps.hyperspaceHash foo: ", hyperspaceHashSelectedValue);
  // console.log("newProps.activeHyperspaceJump foo: ", activeHyperspaceJumpValue);
  // console.log("Hyperspace hash: ", hyperspaceHash);

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


// function testNavigation() {

//     getPathDataShortest('Tatooine', 'Herdessa', 5).then(response => {
//     // getPathDataMany('Tatooine', 'Herdessa', 20, 10).then(response => {
//     // getPathDataMany('Hovan', 'Tyluun', 40, 20).then(response => {
//       return response.json();
//     }).then(data => {
//       console.log("hyperspace route: ", data.paths.length);
//       this.setState({PathCollection: data});
//     }).catch(err => {
//       console.log("err: ", err);
//     });;

//     getHyperspacePathCollection({
//       start: 'Tatooine',
//       end: 'Herdessa',
//       maxJumps: 20,
//       limit: 10,
//       shortest: false
//     });
// }

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

// export default HyperspaceNavigation;
export default connect(mapStateToProps)(HyperspaceNavigation);