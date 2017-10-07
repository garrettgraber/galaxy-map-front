import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import HyperspaceData from 'json-loader!../../data/hyperspace.geojson';
import { HyperSpacePathCollection, Point } from '../../classes/stellarClasses.js';

import HyperspacePath from './hyperspacePath.js';


// console.log("HyperspaceData: ", HyperspaceData);

class HyperspacePathCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspacePathsComponents: null,
      pathsLoaded: false
    }
  }
  componentDidMount() {
    // console.log("HyperspacePathCollection has mounted");
    console.log("Hyperspace HyperspacePathCollection this.props!: ", this.props);

    if(!this.state.pathsLoaded && !_.isEmpty(this.props.PathCollection)) {
      const HyperspacePathsComponents = createHyperspacePathsComponents(this.props.PathCollection, this.props.EdgeLocations, this.props.hyperspaceHash);
      this.setState({HyperspacePathsComponents: HyperspacePathsComponents});
      this.setState({pathsLoaded: true});
    }
  }
  componentWillReceiveProps(newProps) {
    console.log("newProps in HyperspacePathCollection: ", newProps);
    if(!this.state.pathsLoaded && !_.isEmpty(newProps.PathCollection)) {
      const HyperspacePathsComponents = createHyperspacePathsComponents(newProps.PathCollection, newProps.EdgeLocations, newProps.hyperspaceHash);
      this.setState({HyperspacePathsComponents: HyperspacePathsComponents});
      this.setState({pathsLoaded: true});
    }
  }
  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
  	const zIndex = 270;
    const HyperspacePathsComponents = this.state.HyperspacePathsComponents;
    console.log("HyperspacePathsComponents rendering");
  	return (
        <div >  
          { renderComponentsOrNull(HyperspacePathsComponents) }
        </div>
  	)
  }
}

export default HyperspacePathCollection;

// const mapStateToProps = (state = {}) => {
//     return Object.assign({}, state);
// };

// export default connect(mapStateToProps)(HyperspacePathCollection);



function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}



function createHyperspacePathsComponents(PathCollectionData, StartAndEndLocations, hyperspaceHash) {
  const PathCollection = new HyperSpacePathCollection(
    PathCollectionData.start,
    PathCollectionData.end,
    PathCollectionData.paths,
    PathCollectionData.lanes,
    PathCollectionData.nodes
  );
  // console.log("PathCollection: ", PathCollection.paths.length);

  console.log("hyperspaceHash found little bitch: ", hyperspaceHash);

  const Paths = PathCollection.generateHyperspacePaths();
  const displayedLanes = _.filter(Paths, function(currentPath) { 
    return currentPath.hashValue === hyperspaceHash; 
  });
  console.log("displayedLanes: ", displayedLanes);

  const displayedPaths = (displayedLanes.length > 0)? displayedLanes : Paths;
  console.log("displayedPaths: ", displayedPaths);

  const HyperspacePathsComponents = [];

  for(let Path of displayedPaths) {
    // const index = _.findIndex(Paths, function(el) { return el.hashValue == Path.hashValue });
    // console.log("Path index number: ", index);
    let lanes = Path.createArrayOfHyperspaceLanes(PathCollection.lanes);
    let nodes = Path.createArrayOfHyperspaceNodes(PathCollection.nodes);
    HyperspacePathsComponents.push(<HyperspacePath key={Path.hashValue} Path={Path} lanes={lanes} nodes={nodes}  StartAndEndLocations={StartAndEndLocations}  />);
    // console.log("lanes: ", lanes.length);
    // console.log("nodes: ", nodes.length);
  }
  return HyperspacePathsComponents;

}

