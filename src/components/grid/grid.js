import React from 'react';
import { connect } from 'react-redux';
import { Marker, Pane, GeoJSON, FeatureGroup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import GridLabels from './gridLabels.js';
import GridData from 'json-loader!../../data/grid.geojson';


class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	gridLabelsArray: [],
            gridLabelsReady: false
        };
    }

    componentDidMount() {
    	// console.log("grid ref: ", this.refs.grid.leafletElement);
        // console.log("componentDidMount in grid");
        // console.log("componentDidMount this.props: ", this.props);
    }

    pointToLayer(feature, latlng) {
        // console.log("feature in pointToLayer: ", feature);
        // console.log("latlng in pointToLayer: ", latlng);
    }

    onEachFeature(feature, layer) {
        // console.log("layer: ", layer);
    	// console.log("feature: ", feature);
    	let currentGridValue = feature.properties.grid;
    	let polygonArray = feature.geometry.coordinates[0][0];
        polygonArray = polygonArray.slice(0, 4);
        let polygon = L.polygon(convertGeoJsonToMap(polygonArray));
        let polygonCenter = polygon.getBounds().getCenter();
        let gridInArray = this.state.gridLabelsArray.filter(e => e.grid == currentGridValue);
        const northWestGeoJson = polygonArray[0];
        const southEastGeoJson = polygonArray[2];
        // console.log("northWestGeoJson: ", northWestGeoJson);
        // console.log("southEastGeoJson: ", southEastGeoJson);
        const northWest = geoJsonToLatLng(polygonArray[0]);
        const southEast = geoJsonToLatLng(polygonArray[2]);
        const gridCellBounds = [northWest,  southEast];
        if (gridInArray.length == 0) {
			this.state.gridLabelsArray.push({
	            grid: feature.properties.grid,
	            point: polygonCenter,
                bounds: gridCellBounds
	        });
		}
        if(this.state.gridLabelsArray.length >= 552) {
            console.log("Grid Labels Ready. Release the Krakken! ");
            this.setState({gridLabelsReady: true});
        }
    }

    render() {

    	const zIndex = 260;
    	const gridStyle = {color: '#49fb35', weight: 0.5, fill: false};
        const gridStylePink = {color: '#FF69B4', weight: 0.5, fill: false};

    	return (
            <LayerGroup className="layer-group">
                <Pane className="pane-test" name="grid-pane" style={{ zIndex: zIndex }  }>
        			<GeoJSON data={GridData} style={gridStylePink} ref='geojson' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}/>
                    { this.state.gridLabelsReady && <GridLabels gridLabelsArray={this.state.gridLabelsArray} /> }
                </Pane>
            </LayerGroup>
    	)
    }
}

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

export default Grid;