import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


import RegionsData from 'json-loader!../data/region.geojson';



class Regions extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    	// console.log("componentDidMount in regions");


    }

    pointToLayer() {


    	
    }

    onEachFeature() {


    }



    render() {

    	const zIndex = 250;
    	const regionsStyle = {color: 'purple', weight: 2, fill: false};

    	return (

    		<Pane name="regions-pane" style={{ zIndex: zIndex }}>

    			<GeoJSON data={RegionsData} style={regionsStyle} ref='regions' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}/>

    		</Pane>

    	)
    }
}


export default Regions;