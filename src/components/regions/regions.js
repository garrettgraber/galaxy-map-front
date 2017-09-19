import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import RegionLabels from './regionsLabels.js';
import RegionsData from 'json-loader!../../data/region.geojson';

const RegionsDictionary = {
    "Deep Core": [{
        lat: -18.979025953255267,
        lng: 7.0
    }],
    "Core": [{
        lat: -37.99616267972813,
        lng: 0
    }],
    "Colonies": [{
        lat: -44.96479793033102,
        lng: 3.0
    }],
    "Inner Rim": [{
        lat: -53.4357192066942,
        lng: 0
    }],
    "Expansion Region": [{
        lat: -62.02152819100765,
        lng: 17
    }],
    "Mid RIm": [{
        lat: -69.65708627301174,
        lng: 0
    }],
    "Outer Rim": [{
        lat: -77.76758238272801,
        lng: 0
    }],
    "Wild Space": [{
        lat: -83.13212300319354,
        lng: 0
    }],
    "Unknown Regions": [{
        lat: -10.487811882056683,
        lng: -68.51562500000001
    }],
    "Hutt Space": [{
        lat: -25.16517336866393,
        lng: 110.35937500000001
    }]
};


class Regions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            regionsReady: false,
            regionsLabelArray: []
        }
    }

    componentDidMount() {
    	// console.log("componentDidMount in regions");
    }

    pointToLayer() {
        // console.log("pointToLayer has fired in regions...");
    }

    onEachFeature(feature, layer) {
        const currentRegionValue = feature.properties.region;
        const currentRegionLabel = RegionsDictionary[currentRegionValue][0];
        // console.log("\nregion: ", currentRegionValue);
        // console.log("lat lng: ", currentRegionLabel);
        let regionInArray = this.state.regionsLabelArray.filter(e => (e.region == currentRegionValue));
        if (regionInArray.length == 0) {
            this.state.regionsLabelArray.push({
                region: currentRegionValue,
                lat: currentRegionLabel.lat,
                lng: currentRegionLabel.lng
            });
        }
        if(this.state.regionsLabelArray.length >= 10) {
            console.log("Regions Ready. The Bull is Loose! ");
            this.setState({regionsReady: true});
        }
    }

    regionClick(e) {
        // console.log("region click e: ", e.latlng);
    }

    render() {

    	const zIndex = 240;
    	const regionsStyle = {color: 'purple', weight: 2, fill: false};

    	return (
            <LayerGroup className="layer-group">
        		<Pane name="regions-pane" style={{ zIndex: zIndex }}>
        			<GeoJSON data={RegionsData} style={regionsStyle} ref='regions' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}  onClick={(e) => this.regionClick(e)} />
                    { this.state.regionsReady && <RegionLabels regionsLabelsArray={this.state.regionsLabelArray} /> }
        		</Pane>
            </LayerGroup>
    	)
    }
}


export default Regions;