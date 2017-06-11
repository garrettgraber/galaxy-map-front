import React from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, LayersControl, Pane } from 'react-leaflet';
import L from 'leaflet';
import 'whatwg-fetch';

import { 
    searchSystemsFinish,
    getZoomValue,
    setZoomValue,
    renderMapOn,
    renderMapOff,
    renderMapStatus,
    zoomChangeStatus,
    zoomChangeOn
} from '../actions/actionCreators.js';

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


const awsTileServerUrlEast = 'https://s3-us-east-2.amazonaws.com/tiledata.sw.map.east/tiles-leaflet-7/{z}/{x}/{y}.png';



// console.log("tileServerUrl: ", tileServerUrl);


class MapMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	lat: 0,
        	lng: 0,
        	zoom: 2,
        	map: null,
            mapMoveEnd: false,
            mapZoomEnd: false,
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


        // this.props.dispatch( renderMapOn() );

        console.log("props in mapMain: ", this.props);
    }

    componentWillReceiveProps(newProps) {
    	// console.log("Props update MapMain: ", newProps);
    }

    onZoomend(e) {

    	// console.log("zoom has ended");
   		const currentZoom = this.refs.map.leafletElement.getZoom();
        console.log("\n\n****New Zoom: ****", currentZoom);
        // console.log("Old Zoom: ", this.state.zoom);
    	// this.setState({zoom: currentZoom});
    	// console.log("Map zoom end: ", currentZoom);
        // if(currentZoom >= 7) {
        //     this.setState({blackTiles: true});

        // } 

        this.props.dispatch( getZoomValue() );

        this.props.dispatch( setZoomValue(currentZoom) );

        this.props.dispatch( getZoomValue() );

        // this.props.dispatch( zoomChangeStatus() );


        if(currentZoom === 2) {


            // this.setState({mapMoveEnd: true});

            // this.props.dispatch( renderMapOn() );

            this.props.dispatch( getZoomValue() );

            // console.log("this.props.mapMain: ", this.props);


        }


        console.log("mapMoveEnd: ", this.state.mapMoveEnd);


        this.props.dispatch( renderMapOn() );

        this.setState({mapMoveEnd: false});
        this.setState({mapMoveEnd: true});



        // this.props.dispatch( renderMapOff() );




        // console.log("this.props.mapMain: ", this.props);

        console.log("this.props.zoom on Zoomend: ", this.props.zoom);

    }

    onZoomstart(e) {



        // this.props.dispatch( renderMapOn() );

        this.props.dispatch( renderMapOff() );


        this.setState({mapMoveEnd: false});


    	console.log("Map zoom starting: ", this.props);
        console.log("this.props.zoom: ", this.props.zoom);



    }

    onMovestart(e) {

        console.log("onMovestart has fired...");
        // console.log("mapMoveEnd: ", this.state.mapMoveEnd);



        this.props.dispatch( renderMapOff() );

        this.setState({mapMoveEnd: false});


        console.log("this.props in Movestart: ", this.props);



    }


    onMoveend(e) {

        console.log("onMoveend has fired...");
        console.log("mapMoveEnd: ", this.state.mapMoveEnd);



        // this.props.dispatch( renderMapOff() );


        console.log("this.props on MOveend after render is false: ", this.props);


        if(this.props.searchSystems) {

            this.props.dispatch(searchSystemsFinish());

        }


        this.props.dispatch( renderMapOn() );


        this.setState({mapMoveEnd: true});


        console.log("this.props on MOveend after render set: ", this.props);

    }

    onDragend(e) {
        console.log("onDragend: ", e);

        // this.props.dispatch( renderMapOff() );

        this.props.dispatch( renderMapOn() );

    }


    onDragstart(e) {

        console.log("onDragstart: ", e);
        // this.props.dispatch( renderMapOn() );

        this.props.dispatch( renderMapOff() );


    }


    autoPanStart(e) {

        console.log("autoPanStart: ", e);

    }

    onPanto(e) {


        console.log("onPanto has fired: ", e);

    }


    onViewreset(e) {


        console.log("***onViewreset has fired!!!", e);


    }



    onZoomlevelschange(e) {


        console.log("***onZoomlevelschange has fired!!!", e);

        // this.props.dispatch( zoomChangeOn() );


    }


    onMove(e) {

        console.log("***onMove fired: ", e);
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


        // console.log("this.props in MapMain: ", this.props);


    	return (

            <div>

                <NavBar   map={this.state.map}  />

        		<Map center={[this.props.currentSystem.lat, this.props.currentSystem.lng]} zoom={this.props.zoom} ref='map' onZoomend={e => this.onZoomend(e)} onZoomstart={e => this.onZoomstart(e)} onMoveend={e => this.onMoveend(e)} onMovestart={e => this.onMovestart(e)} onDragend={e => this.onDragend(e)} onDragstart={e => this.onDragstart(e)} onPanto={e => this.onPanto(e)} onMove={e => this.onMove(e)}  onViewreset={e => this.onViewreset(e)}   onZoomlevelschange={e => this.onZoomlevelschange(e)} style={{top: "50px", zIndex: 5}} >

        			<LayersControl>

        				<BaseLayer name="Galaxy" checked={true}>

        					<Pane name="galaxy-pane" style={{ zIndex: zIndexGalaxy }}>

    							<TileLayer url={awsTileServerUrlEast} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} maxZoom={maxZoom}/>

    						</Pane>

    					</BaseLayer>

                        <BaseLayer name="Black" checked={false} >

                            <Pane name="black-pane" style={{ zIndex: zIndexBlack }}>

                                <TileLayer url={blackTileImage} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} />

                            </Pane>

                        </BaseLayer>



                        <Overlay name="Sectors" checked={false}>

                            <Sectors />

                        </Overlay>


    			    	<Overlay name="Regions" checked={false}>

    			    		<Regions map={this.state.map} />

    			    	</Overlay>

                   
                        <Overlay name="Grid" checked={false}>

                            <Grid />

                        </Overlay>

    					<Overlay name="Star Systems" checked={true}  ref="layerContainer" >

    						<StarMap  map={this.state.map} mapMove={this.state.mapMoveEnd}  />

    					</Overlay>

                        <Overlay name="Hyperspace Lanes" checked={false}>

                            <HyperspaceLanes />

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

