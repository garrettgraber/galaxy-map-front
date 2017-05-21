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


// console.log("Grid: ", Grid);

// import GridData from 'json-loader!../data/grid.geojson';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';



const tileServerUrl = 'http://172.17.0.3:8110/tiles-leaflet-7/{z}/{x}/{y}.png';
const blackTileUrl = 'http://172.17.0.3:8110/tiles-black/black-tile.png'
const awsTileServerUrl = 'https://s3-us-west-2.amazonaws.com/tiledata.sw.map/tiles-leaflet-7/{z}/{x}/{y}.png';


console.log("tileServerUrl: ", tileServerUrl);


class MapMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	lat: 0,
        	lng: 0,
        	zoom: 2,
        	map: null
        }
    }

    componentDidMount() {

    	console.log("Map componet has mounted: ", this.props);

    	// console.log("map ref in componet: ", this.refs.map);

    	const mapBounds = this.refs.map.leafletElement.getBounds();
    	const currentZoom = this.refs.map.leafletElement.getZoom();


    	// console.log("map bounds in componet: ", mapBounds);
    	// console.log("currentZoom: ", currentZoom);
    	// console.log("zoom state: ", this.state.zoom);

    	this.refs.map.leafletElement.setMaxBounds(mapBounds);

    	const map = this.refs.map.leafletElement;

    	// this.props.map = map;

    	console.log("map: ", map);

    	if(this.refs.map) {

    		this.setState({map: this.refs.map.leafletElement});


    	}

    }

    componentWillReceiveProps(newProps) {

    	// console.log("Props update MapMain: ", newProps);

    }

    onZoomend(e) {

    	// console.log("zoom has ended");
   		const currentZoom = this.refs.map.leafletElement.getZoom();
    	this.setState({zoom: currentZoom});
    	console.log("Map zoom end: ", currentZoom);

    }

    onZoomstart(e) {

    	console.log("Map zoom starting...");

    }

    render() {

    	const position = [this.state.lat, this.state.lng];


    	const minZoom = 2;
    	const maxZoom = 7;
    	const height = 1000;
    	const width = 1000;
    	const zIndexGalaxy = 210;
        const zIndexBlack = 205;
    	const zIndexGrid = 220;

    	// console.log("map bounds: ", this.refs.map);


    	return (

    		<Map center={[this.props.currentSystem.lat, this.props.currentSystem.lng]} zoom={this.props.currentSystem.zoom} ref='map' onZoomend={e => this.onZoomend(e)} onZoomstart={e => this.onZoomstart(e)} style={{top: "50px", zIndex: 5}} >

    			<LayersControl>

    				<BaseLayer name="Galaxy" checked={true}>

    					<Pane name="galaxy-pane" style={{ zIndex: zIndexGalaxy }}>

							<TileLayer url={tileServerUrl} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} maxZoom={maxZoom}/>

						</Pane>

					</BaseLayer>

                    <BaseLayer name="Black" checked={false} >

                        <Pane name="black-pane" style={{ zIndex: zIndexBlack }}>

                            <TileLayer url={blackTileUrl} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} />

                        </Pane>

                    </BaseLayer>

		            <Overlay name="Grid" checked={false}>

			    		<Grid />

			    	</Overlay>

			    	<Overlay name="Regions" checked={false}>

			    		<Regions map={this.props.map} />

			    	</Overlay>

			    	<Overlay name="Sectors" checked={false}>

			    		<Sectors />

			    	</Overlay>


			    	<Overlay name="Hyperspace Lanes" checked={false}>

			    		<HyperspaceLanes />

			    	</Overlay>


					<Overlay name="Stars Systems" checked={false}  ref="layerContainer" >

						<StarMap zoom={this.state.zoom} map={this.state.map}/>

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




const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default MapMain;

export default connect(mapStateToProps)(MapMain);

