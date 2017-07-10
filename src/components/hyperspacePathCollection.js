import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import HyperspaceData from 'json-loader!../data/hyperspace.geojson';
import { HyperSpacePathCollection, HyperSpacePath } from '../classes/stellarClasses.js';

console.log("HyperspaceData: ", HyperspaceData);

class HyperspacePathCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspacePathsComponents: [],
    }
  }
  componentDidMount() {
    console.log("Hyperspace HyperspacePathCollection this.props!: ", this.props);

    // this.createHyperspacePaths();
    


  }

  createHyperspacePaths() {

    const PathObjectCollection = this.props.PathObjectCollection;

    for(let Path of this.props.PathObjectCollection) {

      let lanes = Path.createArrayOfHyperspaceLanes(PathObjectCollection.lanes);
      let nodes = Path.createArrayOfHyperspaceNodes(PathObjectCollection.nodes);

      console.log("lanes: ", lanes);
      console.log("nodes: ", nodes);

    }
    
  }

  componentWillReceiveProps(newProps) {
    console.log("newProps in HyperspacePathCollection: ", newProps);

    const PathCollectionTemp = new HyperSpacePathCollection(
      newProps.PathCollection.start,
      newProps.PathCollection.end,
      newProps.PathCollection.paths,
      newProps.PathCollection.lanes,
      newProps.PathCollection.nodes
    );

    console.log("PathCollectionTemp: ", PathCollectionTemp);

    const Path = PathCollectionTemp.generateHyperspacePath();
    console.log("Path: ", Path);
  }
    
  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
  	const zIndex = 270;
    const HyperspacePathsComponents = this.state.HyperspacePathsComponents;
    console.log("\n\HyperspacePathsComponents in render: ", HyperspacePathsComponents.length);
  	return (
  		<div >
        { this.state.HyperspacePathsComponents }
      </div>
  	)
  }
}
// export default HyperspacePathCollection;

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspacePathCollection);
