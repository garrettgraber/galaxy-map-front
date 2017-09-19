import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON, CircleMarker, Popup, Circle, Tooltip, Marker, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import 'whatwg-fetch';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';

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


class HyperspaceNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspaceCollectionsComponents: [],
      HSpaceComponentsMaster: []
    };
  }
  componentDidMount() { }
  onEachFeature(feature, layer) {
    if(feature.properties.hyperspace) {
      layer.bindPopup(feature.properties.hyperspace)
      .on('click', function (e) {
          this.openPopup();
      })
      // .on('mouseout', function (e) {
      //     this.closePopup();
      // });
    } else {
      layer.bindPopup("Unamed Hyperspace Lane")
      .on('click', function (e) {
          this.openPopup();
      })
      // .on('mouseout', function (e) {
      //     this.closePopup();
      // })s;
    }
  }
  componentWillReceiveProps(newProps) {
    
    if(newProps.update) {

      console.log("\nnewProps.update in Hyperspace Navigation: ", newProps.update);
      console.log("HyperspaceNavigation this.props: ", this.props);

      const StartPoint = this.props.hyperspaceStartPoint;
      const EndPoint = this.props.hyperspaceEndPoint;
      const StartNode = this.props.hyperspaceStartNode;
      const EndNode = this.props.hyperspaceEndNode;

      let navComponentsRendered = [];

      if(this.props.hyperspacePathCollections.length > 0) {

        if(this.props.hyperspacePathChange) {

          const EdgeLocationsLiteral = {
            StartPoint: StartPoint,
            EndPoint: EndPoint,
            StartNode: StartNode,
            EndNode: EndNode
          };

          const EdgeLocations = _.cloneDeep(EdgeLocationsLiteral);

          const HSpaceCollectionsComponents = createCollectionsComponents(this.props.hyperspacePathCollections, EdgeLocations);
          console.log("HSpaceCollectionsComponents: ", HSpaceCollectionsComponents);
          this.setState({HyperspaceCollectionsComponents: HSpaceCollectionsComponents});
          navComponentsRendered = HSpaceCollectionsComponents;
          const startNavigationComponent = NavigationPointComponent(StartPoint, true);
          navComponentsRendered.push(startNavigationComponent);
          const endNavigationComponent = NavigationPointComponent(EndPoint, false);
          navComponentsRendered.push(endNavigationComponent);
          this.props.dispatch(stopUpdatingHyperspacePath());

        } else {

          navComponentsRendered = _.cloneDeep(this.state.HyperspaceCollectionsComponents);

        }

        const FirstHyperspacePath = this.props.hyperspacePathCollections[0];

        // console.log("FirstHyperspacePath.start: ", FirstHyperspacePath.start);
        // console.log("StartNode.nodeId: ", StartNode.nodeId);
        // console.log("FirstHyperspacePath.end: ", FirstHyperspacePath.end);
        // console.log("EndNode.nodeId: ", EndNode.nodeId);

        if(FirstHyperspacePath.start !== StartNode.nodeId) {
          console.log("rendered start on first pass through");
          const startNavigationComponent = NavigationPointComponent(StartPoint, true);
          navComponentsRendered.push(startNavigationComponent);
        }

        if(FirstHyperspacePath.end !== EndNode.nodeId) {
          console.log("rendered end on first pass through");
          const endNavigationComponent = NavigationPointComponent(EndPoint, false);
          navComponentsRendered.push(endNavigationComponent);
        }

      } else {

        if(!this.props.hyperspacePathChange && StartPoint.lat && StartPoint.lng) {
          const startNavigationComponent = NavigationPointComponent(StartPoint, true);
          navComponentsRendered.push(startNavigationComponent);
        }

        if(!this.props.hyperspacePathChange && EndPoint.lat && EndPoint.lng) {
          const endNavigationComponent = NavigationPointComponent(EndPoint, false);
          navComponentsRendered.push(endNavigationComponent);
        }

      }

      console.log("navComponentsRendered rendered array: ", navComponentsRendered);
      this.setState({HSpaceComponentsMaster: navComponentsRendered});

      this.props.dispatch(hyperspaceNavigationUpdateOff());

    }

  }
  pointToLayer(feature, latlng) {

  }
  quickTest() {
    this.props.dispatch(getHyperspacePathCollection({
      start: 'Tatooine',
      end: 'Herdessa',
      maxJumps: 20,
      limit: 1,
      shortest: true
    }));
  }
  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
  	const zIndex = 290;
    const navComponents = renderComponentsOrNull(this.state.HSpaceComponentsMaster);

    // console.log("\nHyperspace Navigation is rendering...");
    // console.log("HyperspaceNavigation props: ", this.props);
    // console.log("HyperspaceNavigation state: ", this.state);
    // console.log("navComponents: ", navComponents);

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


function mergeComponenets(component1, component2) {
  let resultingComponents = [];
  const componentsArray = [component1, component2];
  for(let component of componentsArray) {
    resultingComponents = addComponent(component, resultingComponents);
  }
  return resultingComponents;
}


function addComponent(Component, resultsArray) {
  if(Array.isArray(Component)) {
    const mergedArray = _.merge(Component, resultsArray);
    return mergedArray;
  } else if(Component !== null) {
    resultsArray.push(Component);
    return resultsArray;
  } else {
    return resultsArray;
  }
}


function createCollectionsComponents(PathCollections, EdgeLocations) {
  console.log("\n\n!!!Creat hyperspace paths Components has fired: ", PathCollections.length);
  const PathCollectionsComponentsArray = [];
  for(let PathCollection of PathCollections) {
    PathCollectionsComponentsArray.push(<HyperspacePathCollection key={uuidv4()} PathCollection={PathCollection} EdgeLocations={EdgeLocations} />);
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


function testNavigation() {

    getPathDataShortest('Tatooine', 'Herdessa', 5).then(response => {
    // getPathDataMany('Tatooine', 'Herdessa', 20, 10).then(response => {
    // getPathDataMany('Hovan', 'Tyluun', 40, 20).then(response => {
      return response.json();
    }).then(data => {
      console.log("hyperspace route: ", data.paths.length);
      this.setState({PathCollection: data});
    }).catch(err => {
      console.log("err: ", err);
    });;

    getHyperspacePathCollection({
      start: 'Tatooine',
      end: 'Herdessa',
      maxJumps: 20,
      limit: 10,
      shortest: false
    });
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

// export default HyperspaceNavigation;
export default connect(mapStateToProps)(HyperspaceNavigation);