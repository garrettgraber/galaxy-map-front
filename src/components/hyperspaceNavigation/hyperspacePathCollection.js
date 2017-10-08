import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import _ from 'lodash';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import HyperspaceData from 'json-loader!../../data/hyperspace.geojson';
import { HyperSpacePathCollection, Point } from '../../classes/stellarClasses.js';

import { createHyperspacePathsComponents } from './hyperspaceMethods.js'

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

      const HyperspacePathsComponents = createHyperspacePathsComponents(this.props.PathCollection, this.props.EdgeLocations, this.props.hyperspaceHashDisplayed);
      this.setState({HyperspacePathsComponents: HyperspacePathsComponents});
      this.setState({pathsLoaded: true});
    }
  }
  componentWillReceiveProps(newProps) {
    console.log("newProps in HyperspacePathCollection: ", newProps);
    if(!this.state.pathsLoaded && !_.isEmpty(newProps.PathCollection)) {
      
      const HyperspacePathsComponents = createHyperspacePathsComponents(newProps.PathCollection, newProps.EdgeLocations, newProps.hyperspaceHashDisplayed);
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

