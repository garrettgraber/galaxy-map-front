import React from 'react';
import { connect } from 'react-redux';
import {
  Pane,
  GeoJSON,
  CircleMarker,
  Popup,
  Circle,
  Tooltip,
  Marker,
  FeatureGroup,
  LayerGroup
} from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import 'whatwg-fetch';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';
import distance from 'euclidean-distance';
import Geohash from 'latlon-geohash';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SearchComponents: []
    };
  }

  componentDidMount() {
    // this.setState({zoom: this.props.newZoom});
  }

  componentWillReceiveProps(newProps) {

  }

  render() {

  	const zIndex = 255;
    const navComponents = renderComponentsOrNull(this.state.SearchComponents);

  	return (
      <LayerGroup>
        <Pane name="hyperspace-navigation-pane" style={{ zIndex: zIndex }}>
          <FeatureGroup> 
            { navComponents }
          </FeatureGroup>
        </Pane>
      </LayerGroup>
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


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(Search);