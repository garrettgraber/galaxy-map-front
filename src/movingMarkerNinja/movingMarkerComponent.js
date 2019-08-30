

import L from 'leaflet';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import 'leaflet-rotatedmarker';

import { Marker } from 'react-leaflet';

// import { type Icon, Marker as LeafletMarker } from 'leaflet'


// import { LeafletProvider, LeafletConsumer } from 'react-leaflet'

// import { LatLng, MapLayerProps } from 'react-leaflet'

import { withLeaflet, MapControl, LeafletProvider, LeafletConsumer, LatLng } from "react-leaflet";

import { leafletMovingMarker } from '../../movingMarkerNinja/movingMarker.js';















class MovingMarkerComponent extends Component {
  constructor(props, context) {
    super(props);
  }

  createLeafletElement(latlngs, durations, options) {
    console.log("options: ", options);
    return leafletMovingMarker(latlngs, durations, options);
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet(MovingMarkerComponent);
