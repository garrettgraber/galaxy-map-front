import React from 'react';
import { connect } from 'react-redux';
import { Marker, Pane, GeoJSON, FeatureGroup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import GridCell from './gridCell.js';


class GridLabels extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        gridLabelsArray: [],
        gridLabelsReady: false
      };
    }

    componentDidMount() {
      const gridLabelsArray = renderGridLabels(this.props.gridLabelsArray);
      this.setState({gridLabelsArray : gridLabelsArray});
      this.setState({gridLabelsReady: true});
    }


    renderGridLabelsComponents() {
      if (this.state.gridLabelsReady) {
          return (this.state.gridLabelsArray);
      } else {
        const gridLabelsArray = renderGridLabels(this.props.gridLabelsArray);
        this.setState({gridLabelsArray : gridLabelsArray});
        this.setState({gridLabelsReady: true});
        return gridLabelsArray;
      }
    }

    render() {
    	return (
        <FeatureGroup className="labels-test">
          { renderComponentsOrNull(this.state.gridLabelsArray) }
        </FeatureGroup>
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


function renderGridLabels(labelArrayTemp) {
  const gridLabelsArrayTemp = [];
  for(let currentGridObject of labelArrayTemp) {
    const gridName = currentGridObject.grid;
    const lat = currentGridObject.point.lat;
    const lng = currentGridObject.point.lng;
    gridLabelsArrayTemp.push(<GridCell key={gridName} grid={gridName} lat={lat} lng={lng} bounds={currentGridObject.bounds}/>);
  }
  return gridLabelsArrayTemp;
};


function convertGeoJsonToMap(geojsonArray) {
  const latLngArray = [];
  for(let currentCoordinateArray of geojsonArray) {
    latLngArray.push(geoJsonToLatLng(currentCoordinateArray));
  }
  return latLngArray;
};


function geoJsonToLatLng(geojsonLngLat) {
  return [ geojsonLngLat[1], geojsonLngLat[0] ];
};


export default GridLabels;