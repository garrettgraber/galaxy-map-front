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
console.log("HyperspaceData: ", HyperspaceData);

class HyperspacePath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspacePathComponents: [],
    }
  }
  componentDidMount() {
    console.log("Hyperspace data has been found!: ", this.props);
    const PathObject = this.props.PathObject;
  }
  
  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
    const HyperspacePathComponents = this.state.HyperspacePathComponents;
    console.log("\n\HyperspacePathComponents in render: ", HyperspacePathComponents.length);
  	return (
  		<div >
        { this.state.HyperspacePathComponents }
      </div>
  	)
  }
}
// export default HyperspacePath;

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspacePath);