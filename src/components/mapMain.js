import React from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, LayersControl, Pane } from 'react-leaflet';
import L from 'leaflet';
import 'whatwg-fetch';
const { BaseLayer, Overlay } = LayersControl;


import Grid from './grid.js';
import Regions from './regions.js';
import Sectors from './sectors.js';
import HyperspaceLanes from './hyperspaceLanes.js';
import StarMap from './starMap.js';


console.log("Grid: ", Grid);

// import GridData from 'json-loader!../data/grid.geojson';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';



const tileServerUrl = 'http://172.17.0.3:8110/tiles-leaflet-7/{z}/{x}/{y}.png';
const awsTileServerUrl = 'https://s3-us-west-2.amazonaws.com/tiledata.sw.map/tiles-leaflet-7/{z}/{x}/{y}.png';


console.log("tileServerUrl: ", tileServerUrl);


class MapMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	lat: 0,
        	lng: 0,
        	zoom: 2
        }
    }

    componentDidMount() {

    	console.log("Map componet has mounted");

    	console.log("map ref in componet: ", this.refs.map);

    	const mapBounds = this.refs.map.leafletElement.getBounds();
    	const currentZoom = this.refs.map.leafletElement.getZoom();


    	console.log("map bounds in componet: ", mapBounds);
    	console.log("currentZoom: ", currentZoom);
    	console.log("zoom state: ", this.state.zoom);


    	this.refs.map.leafletElement.setMaxBounds(mapBounds);



    }

    onZoomend(e) {

    	console.log("zoom has ended");
   		const currentZoom = this.refs.map.leafletElement.getZoom();
    	console.log("currentZoom: ", currentZoom);
    	this.setState({zoom: currentZoom});

    }

    render() {

    	const position = [this.state.lat, this.state.lng];


    	const minZoom = 2;
    	const maxZoom = 7;
    	const height = 1000;
    	const width = 1000;
    	const zIndexGalaxy = 210;
    	const zIndexGrid = 220;

    	console.log("map bounds: ", this.refs.map);


    	return (
    		<Map center={position} zoom={this.state.zoom} ref='map' onZoomend={e => this.onZoomend(e)}>

    			<LayersControl>

    				<BaseLayer name="Galaxy" checked={true}>

    					<Pane name="galaxy-pane" style={{ zIndex: zIndexGalaxy }}>

							<TileLayer url={tileServerUrl} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} maxZoom={maxZoom}/>

						</Pane>

					</BaseLayer>

		            <Overlay name="Grid" checked={false}>

			    		<Grid />

			    	</Overlay>

			    	<Overlay name="Regions" checked={false}>

			    		<Regions />

			    	</Overlay>

			    	<Overlay name="Sectors" checked={false}>

			    		<Sectors />

			    	</Overlay>


			    	<Overlay name="Hyperspace Lanes" checked={false}>

			    		<HyperspaceLanes />

			    	</Overlay>


					<Overlay name="Stars Systems" checked={false}  ref="layerContainer" >

						<StarMap zoom={this.state.zoom} />

					</Overlay>

				</LayersControl>

    		</Map>

    	)
    }

}



// <Overlay name="Stars Systems" checked={false}>

// 	<StarMap />

// </Overlay>



function  getStarData() {

	fetch('/api/has-location')  
	.then(function(response) {
    	return response.json();
	});

}

export default MapMain;