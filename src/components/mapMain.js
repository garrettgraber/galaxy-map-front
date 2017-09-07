import React from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, LayersControl, Pane } from 'react-leaflet';
import L from 'leaflet';
import 'whatwg-fetch';
import uuidv4 from 'uuid/v4';

import { 
    searchSystemsFinish,
    getZoomValue,
    setZoomValue,
    renderMapOn,
    renderMapOff,
    renderMapStatus,
    zoomChangeStatus,
    zoomChangeOn,
    generateNewMapHash
} from '../actions/actionCreators.js';
import { findAndSetNearsetHyperspaceNode } from '../actions/actions.js';


const { BaseLayer, Overlay } = LayersControl;

import Grid from './grid/grid.js';
import Regions from './regions/regions.js';
import Sectors from './sectors/sectors.js';
import HyperspaceLanesData from './hyperspaceData/hyperspaceLanesData.js';
import StarMap from './stars/starMap.js';
import NavBar from './navBar/navBar.js';
import HyperspaceNavigation from './hyperspaceNavigation/hyperspaceNavigation.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import imgBlack from '../images/black-tile.png';
import DatabaseLinks from 'docker-links';


const tileServerUrlLevel8 = 'http://172.17.0.6:8110/tiles-leaflet-8/{z}/{x}/{y}.png';
const tileServerUrlLevel7 = 'http://172.17.0.6:8110/tiles-leaflet-7/{z}/{x}/{y}.png';

const tileServerUrl = tileServerUrlLevel7;

const blackTileUrl = 'http://172.17.0.6:8110/tiles-black/black-tile.png';
const blackTileImage = imgBlack;
const awsTileServerUrl = 'https://s3-us-west-2.amazonaws.com/tiledata.sw.map/tiles-leaflet-7/{z}/{x}/{y}.png';
const awsTileServerUrlEast = 'https://s3.amazonaws.com/tiledata.sw.map.east/tiles-leaflet-7/{z}/{x}/{y}.png'

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
      blackTiles: false,
      StartLocation: {
        lat: null,
        lng: null
      },
      EndLocation: {
        lat: null,
        lng: null
      }
    }
  }

  componentDidMount() {
  	const mapBounds = this.refs.map.leafletElement.getBounds();
  	const currentZoom = this.refs.map.leafletElement.getZoom();
  	this.refs.map.leafletElement.setMaxBounds(mapBounds);
  	if(this.refs.map) {
  		this.setState({map: this.refs.map.leafletElement});
  	}
      // this.props.dispatch( renderMapOn() );
    console.log("MapMain has mounted");
    console.log("props in mapMain: ", this.props);
  }

  componentWillReceiveProps(newProps) {
  	// console.log("Props update MapMain: ", newProps);
  }

  onZoomend(e) {
 		const currentZoom = this.refs.map.leafletElement.getZoom();
      console.log("\n\n****New Zoom: ****", currentZoom);
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
      // this.props.dispatch( renderMapOn() );
      // this.setState({mapMoveEnd: false});
      // this.setState({mapMoveEnd: true});
      // this.props.dispatch( renderMapOff() );
      // console.log("this.props.mapMain: ", this.props);
      console.log("this.props.zoom on Zoomend: ", this.props.zoom);

      this.props.dispatch( generateNewMapHash() );

  }

  onZoomstart(e) {
      // this.props.dispatch( renderMapOn() );
      this.props.dispatch( renderMapOff() );
      // this.setState({mapMoveEnd: false});
      console.log("Map zoom starting: ", this.props);
      console.log("this.props.zoom: ", this.props.zoom);
  }

  onMovestart(e) {
      // console.log("onMovestart has fired...");
      // console.log("mapMoveEnd: ", this.state.mapMoveEnd);
      // this.props.dispatch( renderMapOff() );
      // this.setState({mapMoveEnd: false});
      // console.log("this.props in Movestart: ", this.props);
  }

  onMoveend(e) {
      // console.log("onMoveend has fired...");
      // console.log("mapMoveEnd: ", this.state.mapMoveEnd);
      // this.props.dispatch( renderMapOff() );
      // console.log("this.props on MOveend after render is false: ", this.props);
      if(this.props.searchSystems) {
          this.props.dispatch(searchSystemsFinish());
      }
      if(this.props.zoom > 3) {
          this.props.dispatch( renderMapOn() );
          // this.setState({mapMoveEnd: true});
          // console.log("this.props on MOveend after render set: ", this.props);
      }
  }

  onDragend(e) {
      console.log("onDragend");
      // this.props.dispatch( renderMapOff() );

      this.props.dispatch( renderMapOn() );
      this.setState({mapMoveEnd: true});
  }

  onDragstart(e) {
      console.log("onDragstart");
      this.props.dispatch( renderMapOff() );
      this.setState({mapMoveEnd: false});

      // this.props.dispatch( renderMapOn() );
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

  onClickHyperspaceNavigation(e) {
    if(this.props.pathSearchEnd || this.props.pathSearchStart) {

      console.log("this.props in hyperspace Navigation: ", this.props);
      console.log("hyperspace navigation lat and lng: ", e.latlng);
      const isStartNode = (this.props.pathSearchStart)? true : false;
      const HyperspaceNodeSearch = {
        LatLng: e.latlng,
        isStartNode: isStartNode
      }
      this.props.dispatch(findAndSetNearsetHyperspaceNode(HyperspaceNodeSearch));

      const Location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      if(this.props.pathSearchStart) {
        this.setState({StartLocation: Location});
      }

      if(this.props.pathSearchEnd) {
        this.setState({EndLocation: Location});
      }
      
    }
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
    const defaultStarMapKey = 'StarMap Key';
    const starMapKey = (this.props.renderMap)? uuidv4() : defaultStarMapKey;
      // console.log("this.props in MapMain: ", this.props);
  	return (
      <div>
        <NavBar map={this.state.map}/>
    		<Map center={[this.props.currentSystem.lat, this.props.currentSystem.lng]} zoom={this.props.zoom} ref='map' onZoomend={e => this.onZoomend(e)} onZoomstart={e => this.onZoomstart(e)} onMoveend={e => this.onMoveend(e)} onMovestart={e => this.onMovestart(e)} onDragend={e => this.onDragend(e)} onDragstart={e => this.onDragstart(e)} onPanto={e => this.onPanto(e)} onMove={e => this.onMove(e)}  onViewreset={e => this.onViewreset(e)}   onZoomlevelschange={e => this.onZoomlevelschange(e)} onClick={(e) => this.onClickHyperspaceNavigation(e)} style={{zIndex: 5}} >
    			<LayersControl>
    				<BaseLayer name="Galaxy" checked={true}>
    					<Pane name="galaxy-pane" style={{ zIndex: zIndexGalaxy }}>
							 <TileLayer url={tileServerUrl} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} maxZoom={maxZoom}/>
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
              <StarMap map={this.state.map} mapMove={this.state.mapMoveEnd} mapHash={this.props.mapHash} />
  					</Overlay>
            <Overlay name="Hyperspace Lanes" checked={false}>
              <HyperspaceLanesData />
            </Overlay>
            <Overlay name="Hyperspace Navigation" checked={false}>
              <HyperspaceNavigation update={this.props.updateHyperspaceNavigation}/>
            </Overlay>
				  </LayersControl>
    		</Map>
      </div>
  	)
  }
}

// hyperspacePathUpdate={}

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