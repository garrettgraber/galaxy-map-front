import React from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, LayersControl, Pane } from 'react-leaflet';
import L from 'leaflet';
import 'whatwg-fetch';
import { searchSystemsFinish, getZoomValue, setZoomValue } from '../actions/actionCreators.js';
const { BaseLayer, Overlay } = LayersControl;

import Grid from './grid.js';
import Regions from './regions.js';
import Sectors from './sectors.js';
import HyperspaceLanes from './hyperspaceLanes.js';
import StarMap from './starMap.js';
import NavBar from './navBar.js';



import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import imgBlack from '../images/black-tile.png';
import DatabaseLinks from 'docker-links'




// const DatabaseLinks = require('docker-links').parseLinks(process.env);


console.log("DatabaseLinks: ", DatabaseLinks.parseLinks(process.env));
console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);


// console.log("imgBlack: ", imgBlack);



const tileServerUrl = 'http://172.17.0.4:8110/tiles-leaflet-7/{z}/{x}/{y}.png';
const blackTileUrl = 'http://172.17.0.4:8110/tiles-black/black-tile.png';
const blackTileImage = imgBlack;
const awsTileServerUrl = 'https://s3-us-west-2.amazonaws.com/tiledata.sw.map/tiles-leaflet-7/{z}/{x}/{y}.png';


// console.log("tileServerUrl: ", tileServerUrl);


class MapMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	lat: 0,
        	lng: 0,
        	zoom: 2,
        	map: null,
            mapMoveEvent: false,
            blackTiles: false
        }
    }

    componentDidMount() {

    	// console.log("Map componet has mounted: ", this.props);

    	// console.log("map ref in componet: ", this.refs.map);

    	const mapBounds = this.refs.map.leafletElement.getBounds();
    	const currentZoom = this.refs.map.leafletElement.getZoom();


    	// console.log("map bounds in componet: ", mapBounds);
    	// console.log("currentZoom: ", currentZoom);
    	// console.log("zoom state: ", this.state.zoom);

    	this.refs.map.leafletElement.setMaxBounds(mapBounds);

    	// const map = this.refs.map.leafletElement;

    	// this.props.map = map;

    	// console.log("map: ", map);

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
        console.log("\n\nNew Zoom: ", currentZoom);
        // console.log("Old Zoom: ", this.state.zoom);
    	// this.setState({zoom: currentZoom});
    	// console.log("Map zoom end: ", currentZoom);
        // if(currentZoom >= 7) {
        //     this.setState({blackTiles: true});

        // } 
        this.props.dispatch(setZoomValue(currentZoom));

        console.log("this.props.zoom: ", this.props.zoom);

    }

    onZoomstart(e) {

    	console.log("Map zoom starting: ", e);

        console.log("this.props.zoom: ", this.props.zoom);

    }

    onMovestart(e) {

        console.log("onMovestart has fired...");
        this.setState({mapMoveEvent: true});

        console.log("mapMoveEvent: ", this.state.mapMoveEvent);

    }


    onMoveend(e) {

        console.log("onMoveend has fired...");
        this.setState({mapMoveEvent: false});

        console.log("mapMoveEvent: ", this.state.mapMoveEvent);


        if(this.props.searchSystems) {

            this.props.dispatch(searchSystemsFinish());

        }

    }

    onDragend(e) {
        console.log("onDragend: ", e);
    }


    autoPanStart(e) {

        console.log("autoPanStart: ", e);

    }


    triggerZoomStart(e) {

            this.map.on('moveend', this.onMoveEnd);



    }


    render() {

    	// const position = [this.state.lat, this.state.lng];
    	const minZoom = 2;
    	const maxZoom = 7;
    	// const height = 1000;
    	// const width = 1000;
    	const zIndexGalaxy = 210;
        const zIndexBlack = 205;
    	const zIndexGrid = 220;


        console.log("this.props in MapMain: ", this.props);


    	return (

            <div>

                <NavBar  />

        		<Map center={[this.props.currentSystem.lat, this.props.currentSystem.lng]} zoom={this.props.zoom} ref='map' onZoomend={e => this.onZoomend(e)} onZoomstart={e => this.onZoomstart(e)}  onMoveend={e => this.onMoveend(e)} onMovestart={e => this.onMovestart(e)}    onDragend={e => this.onDragend(e)}   style={{top: "50px", zIndex: 5}} >

        			<LayersControl>

        				<BaseLayer name="Galaxy" checked={true}>

        					<Pane name="galaxy-pane" style={{ zIndex: zIndexGalaxy }}>

    							<TileLayer url={awsTileServerUrl} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} maxZoom={maxZoom}/>

    						</Pane>

    					</BaseLayer>

                        <BaseLayer name="Black" checked={false} >

                            <Pane name="black-pane" style={{ zIndex: zIndexBlack }}>

                                <TileLayer url={blackTileImage} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} />

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


    					<Overlay name="Stars Systems" checked={true}  ref="layerContainer" >

    						<StarMap map={this.state.map} mapMove={this.state.mapMoveEvent} />

    					</Overlay>

    				</LayersControl>

        		</Map>
            </div>


    	)
    }

}




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

