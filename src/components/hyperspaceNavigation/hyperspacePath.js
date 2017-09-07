import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import HyperspaceData from 'json-loader!../../data/hyperspace.geojson';
import HyperspaceNode from './hyperspaceNode.js';
import HyperspaceLane from './hyperspaceLane.js';
import HyperspaceFreeSpaceJump from './hyperspaceFreeSpaceJump.js';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';

// console.log("HyperspaceData: ", HyperspaceData);

const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};

class HyperspacePath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspacePathComponents: [],
    }
  }
  componentDidMount() {
    console.log("HyperspacePath has mounted: ", this.props);
    const Path = this.props.Path;
    const EdgeLocations = this.props.StartAndEndLocations;
    const hyperspacePathComponents = generateHyperspaceNodesAndLanes(this.props.nodes, this.props.lanes);
    const startPointEqualsNode = nodeAndPointAreEqual(EdgeLocations.StartPoint, EdgeLocations.StartNode);
    const endPointEqualsNode = nodeAndPointAreEqual(EdgeLocations.EndPoint, EdgeLocations.EndNode);
    // console.log("startPointEqualsNode: ", startPointEqualsNode);
    // console.log("endPointEqualsNode: ", endPointEqualsNode);
    if(!startPointEqualsNode) {
      const PointToNodeJumpComponentStart = createFreespaceLane(EdgeLocations.StartNode, EdgeLocations.StartPoint);
      // console.log("Start PointToNodeJumpComponent: ", PointToNodeJumpComponentStart);
      hyperspacePathComponents.push(PointToNodeJumpComponentStart);
    }
    if(!endPointEqualsNode) {
      const PointToNodeJumpComponentEnd = createFreespaceLane(EdgeLocations.EndNode, EdgeLocations.EndPoint);
      // console.log("End PointToNodeJumpComponent: ", PointToNodeJumpComponentEnd);
      hyperspacePathComponents.push(PointToNodeJumpComponentEnd);
    }
    // console.log("hyperspacePathComponents after freespaceJump addition: ", hyperspacePathComponents);
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

// const mapStateToProps = (state = {}) => {
//     return Object.assign({}, state);
// };

export default HyperspacePath;
// export default connect(mapStateToProps)(HyperspacePath);



function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}



function createLanesComponents(lanes) {
  const laneComponents = [];
  for(let Lane of lanes) {
    laneComponents.push(<HyperspaceLane key={Lane.hyperspaceHash}  HyperSpaceLaneObject={Lane} style={hyperspaceLanesStylePink}/>);
  }
  return laneComponents;
}


function createNodesComponents(nodes) {
  const nodesComponents = [];
  for(let Node of nodes) {
    nodesComponents.push(<HyperspaceNode key={"PathId:" + uuidv4()} HyperSpaceNodeObject={Node} style={{color: 'gold'}}/>);
  }
  return nodesComponents;
}

function generateHyperspaceNodesAndLanes(nodes, lanes) {
  const hyperspaceNodes = createNodesComponents(nodes);
  const hyperspaceLanes = createLanesComponents(lanes);
  // console.log("\nhyperspaceNodes.length: ", hyperspaceNodes.length);
  // console.log("hyperspaceLanes.length: ", hyperspaceLanes.length);
  const nodeAndLaneComponents = [];
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



function createFreespaceLane(Node, Point) {
  return (<HyperspaceFreeSpaceJump  key={uuidv4()} HyperSpaceNode={Node} HyperSpacePoint={Point} style={hyperspaceLanesStylePink}/>);
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
