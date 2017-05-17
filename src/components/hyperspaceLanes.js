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



class HyperspaceLanes extends React.Component {
    constructor(props) {
        super(props);

    }

    onEachFeature(feature, layer) {

        if(feature.properties.hyperspace) {

            layer.bindPopup(feature.properties.hyperspace)
            .on('mouseover', function (e) {
                this.openPopup();
            })
            .on('mouseout', function (e) {
                this.closePopup();
            });

        } else {

            layer.bindPopup("Unamed Hyperspace Lane")
            .on('mouseover', function (e) {
                this.openPopup();
            })
            .on('mouseout', function (e) {
                this.closePopup();
            });
        }
	
    }

    pointToLayer(feature, latlng) {




    }

    render() {

    	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    	const zIndex = 270;

    	return (

    		<Pane name="hyperspace-pane" style={{ zIndex: zIndex }}>

    			<GeoJSON data={HyperspaceData} style={hyperspaceLanesStyle} ref='hyperspace' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}/>

    		</Pane>

    	)

    }

}

export default HyperspaceLanes;

