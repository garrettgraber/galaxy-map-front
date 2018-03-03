import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import HyperSpaceNode from './hyperspaceNode.js';
import HyperSpaceLane from './hyperspaceLane.js';
import HyperSpaceLaneOverlay from './hyperspaceLaneOverlay.js';
import { createFreespaceLane } from './hyperspaceMethods.js';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';

const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};

class HyperspacePath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspacePathComponents: [],
    }
  }
  componentDidMount() {
    const Path = this.props.Path;
    const EdgeLocations = this.props.StartAndEndLocations;
    const hyperspacePathComponents = generateHyperspaceNodesAndLanes(this.props.nodes, this.props.lanes, this.props.isSinglePath);
    const startPointEqualsNode = nodeAndPointAreEqual(EdgeLocations.StartPoint, EdgeLocations.StartNode);
    const endPointEqualsNode = nodeAndPointAreEqual(EdgeLocations.EndPoint, EdgeLocations.EndNode);
    if(!startPointEqualsNode) {
      const PointToNodeJumpComponentStart = createFreespaceLane(EdgeLocations.StartNode, EdgeLocations.StartPoint, true);
      hyperspacePathComponents.push(PointToNodeJumpComponentStart);
    }
    if(!endPointEqualsNode) {
      const PointToNodeJumpComponentEnd = createFreespaceLane(EdgeLocations.EndNode, EdgeLocations.EndPoint, false);
      hyperspacePathComponents.push(PointToNodeJumpComponentEnd);
    }
    this.setState({HyperspacePathComponents: hyperspacePathComponents});
  }
    
  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
    const HyperspacePathComponents = this.state.HyperspacePathComponents;
  	return (
  		<div >
        { renderComponentsOrNull(this.state.HyperspacePathComponents) }
      </div>
  	)
  }
}

export default HyperspacePath;

function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}

function createLanesComponents(lanes, isSinglePath) {
  const laneComponents = [];
  let lanePathCoordinates = [];
  for(let Lane of lanes) {
    laneComponents.push(<HyperSpaceLane key={Lane.hyperspaceHash}  HyperSpaceLaneObject={Lane} style={hyperspaceLanesStylePink} isSinglePath={isSinglePath} />);
    lanePathCoordinates = lanePathCoordinates.concat(Lane.coordinates);
  }
  return laneComponents;
}

function createVisibleToplane(lanes, isSinglePath) {
  let lanePathCoordinates = [];
  for(let Lane of lanes) {
    lanePathCoordinates = lanePathCoordinates.concat(Lane.coordinates);
  }
  console.log("Total coordinates: ", lanePathCoordinates.length);
  const startPoint = lanePathCoordinates[ 0 ];
  const endPoint = lanePathCoordinates[ lanePathCoordinates.length - 1 ];
  const hyperspaceHash = uuidv4();
  return [<HyperSpaceLaneOverlay key={hyperspaceHash}  pathCoordinates={lanePathCoordinates} style={hyperspaceLanesStylePink} isSinglePath={isSinglePath} />];
}


function createNodesComponents(nodes) {
  const nodesComponents = [];
  for(let Node of nodes) {
    nodesComponents.push(<HyperSpaceNode key={"PathId:" + uuidv4()} HyperSpaceNodeObject={Node} style={{color: 'gold'}}/>);
  }
  return nodesComponents;
}

function generateHyperspaceNodesAndLanes(nodes, lanes, isSinglePath) {
  const hyperspaceNodes = createNodesComponents(nodes);
  const hyperspaceLanes = createLanesComponents(lanes, isSinglePath);
  const hyperspaceTopLane = createVisibleToplane(lanes, isSinglePath);
  const nodeAndLaneComponents = [];
  nodeAndLaneComponents.push(hyperspaceTopLane[0]);
  for(let i=0; i < hyperspaceLanes.length; i++) {
    let Lane = hyperspaceLanes[i];
    nodeAndLaneComponents.push(Lane);
  }
  for(let i=0; i < hyperspaceNodes.length; i++) {
    let Node = hyperspaceNodes[i];
    nodeAndLaneComponents.push(Node);
  }
  return nodeAndLaneComponents;
}

function nodeAndPointAreEqual(point1, point2) {
  const sameName = (point1.system === point2.system)? true : false;
  const sameLatitude = (point1.lat === point2.lat)? true : false;
  const sameLongitude = (point1.lng === point2.lng)? true : false;
  if(sameName && sameLatitude && sameLongitude) {
    return true;
  } else {
    return false;
  }
}