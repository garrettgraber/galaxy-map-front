import React from 'react';
import { connect } from 'react-redux';
import Control from 'react-leaflet-control';
import { Map, TileLayer, LayersControl, Pane } from 'react-leaflet';
import L from 'leaflet';
import 'whatwg-fetch';
import uuidv4 from 'uuid/v4';

import { 
    searchSystemsFinish,
    renderMapOn,
    renderMapOff,
    renderMapStatus,
    zoomChangeStatus,
    zoomChangeOn,
    generateNewMapHash,
    viewHasChangedAndRender,
    setMapCenterAndZoom,
    setMapZoom,
    addItemToDataStream
} from '../actions/actionCreators.js';
import { findAndSetNearsetHyperspaceNode } from '../actions/actions.js';


const { BaseLayer, Overlay } = LayersControl;

import Grid from './grid/grid.js';
import Regions from './regions/regions.js';
import Sectors from './sectors/sectors.js';
import HyperspaceLanesData from './hyperspaceData/hyperspaceLanesData.js';
import StarMap from './stars/starMap.js';
import SideBarController from './sideBar/sideBarController.js';
import SideBar from './sideBar/sideBar.js';
import DataStream from './dataStream/dataStream.js';

import HyperspaceNavigation from './hyperspaceNavigation/hyperspaceNavigation.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import imgBlack from '../images/black-tile.png';
import DatabaseLinks from 'docker-links';

const tileServerUrlLevel8 = 'http://172.17.0.6:8110/tiles-leaflet-8/{z}/{x}/{y}.png';
// const tileServerUrlLevel7 = 'http://172.17.0.6:8110/tiles-leaflet-7/{z}/{x}/{y}.png';

const blackTileUrl = 'http://172.17.0.6:8110/tiles-black/black-tile.png';
const blackTileImage = imgBlack;
// const awsTileServerUrl = 'https://s3-us-west-2.amazonaws.com/tiledata.sw.map/tiles-leaflet-7/{z}/{x}/{y}.png';
// const awsTileServerUrlEast = 'https://s3.amazonaws.com/tiledata.sw.map.east/tiles-leaflet-7/{z}/{x}/{y}.png'
// const awsTileServerUrlEastEight = 'https://s3.amazonaws.com/tiledata.sw.8.map.east/tiles-leaflet-8/{z}/{x}/{y}.png';
const awsTileServerUrlEastMaster = 'https://s3.amazonaws.com/tiledata.sw.map.east.master/tiles-leaflet-8-master/{z}/{x}/{y}.png';

const activeTileServer = tileServerUrlLevel8;

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
  	const mapBounds = this.refs.map.leafletElement.getBounds();
  	const currentZoom = this.refs.map.leafletElement.getZoom();
  	this.refs.map.leafletElement.setMaxBounds(mapBounds);
  	if(this.refs.map) {
  		this.setState({map: this.refs.map.leafletElement});
  	}
      // this.props.dispatch( renderMapOn() );
    console.log("MapMain has mounted");
    console.log("props in mapMain: ", this.props);
    this.props.dispatch(setMapZoom(currentZoom));
  }

  componentWillReceiveProps(newProps) {
  	// console.log("Props update MapMain: ", newProps);
  }

  onZoomend(e) {

    console.log("onZoomend has fired: ", e);
    const mapBounds = this.refs.map.leafletElement.getBounds();
    const currentZoom = this.refs.map.leafletElement.getZoom();
    console.log("mapBounds: ", mapBounds);
    console.log("currentZoom: ", currentZoom);
    console.log("props in mapMain: ", this.props);

    if(!(currentZoom === 2 && this.props.mapCenterAndZoom.zoom === 3)) {
      this.props.dispatch(setMapZoom(currentZoom));
    }

  }

  onZoomstart(e) {

    console.log("onZoomstart has fired: ", e);

  }

  onMovestart(e) {
      console.log("onMovestart has fired...");
  }

  onMoveend(e) {
      // if(this.props.searchSystems) {
      //     this.props.dispatch(searchSystemsFinish());
      // }
      console.log("onMoveend has fired: ", e);

      // if(this.props.mapCenterAndZoom.zoom !== ViewportValues.zoom) {
      //   console.log("map zoom has changed: ", ViewportValues.zoom);
      // } else {
      //   console.log("map center has changed: ", ViewportValues.center);
      // }

      // const mapBounds = this.refs.map.leafletElement.getBounds();
      // console.log('Map Bounds after viewport has changed: ', mapBounds);

      // this.props.dispatch(setMapCenterAndZoom(
      //   ViewportValues.center,
      //   ViewportValues.zoom
      // ));

  }

  onDragend(e) {
      console.log("onDragend: ", e);     
  }

  onDragstart(e) {
      console.log("onDragstart: ", e);
  }

  onMove(e) {
      // console.log("***onMove fired: ", e);
  }

  activateSearchSystems(e) {
    console.log("Search Systems Now Active");
  }

  activateMapControls(e) {
    console.log("Map Controls Now Active");

  }

  activateHyperspaceNavigationControls(e) {
    console.log("Hyperspace Navigation Now Active");

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
      
    } else {
      return null;
    }
  }

  onViewportChange(ViewportValues) {
    console.log("viewport has started to change: ", ViewportValues);
    // if(this.props.mapCenterAndZoom.zoom !== ViewportValues.zoom) {
    //   console.log("map zoom has changed: ", ViewportValues.zoom);
    // } else {
    //   console.log("map center has changed: ", ViewportValues.center);
    // }

    // this.props.dispatch(setMapCenterAndZoom(
    //   ViewportValues.center,
    //   ViewportValues.zoom
    // ));
  }

  onViewportChanged(ViewportValues) {
    console.log("viewport has changed: ", ViewportValues);
    
    if(this.props.mapCenterAndZoom.zoom !== ViewportValues.zoom) {
      console.log("map zoom has changed: ", ViewportValues.zoom);
    } else {
      console.log("map center has changed: ", ViewportValues.center);
    }

    const mapBounds = this.refs.map.leafletElement.getBounds();
    console.log('Map Bounds after viewport has changed: ', mapBounds);

    this.props.dispatch(setMapCenterAndZoom(
      ViewportValues.center,
      ViewportValues.zoom
    ));
    
  }

  render() {
  	const minZoom = 2;
  	const maxZoom = 8;
  	// const height = 1000;
  	// const width = 1000;
  	const zIndexGalaxy = 210;
    const zIndexBlack = 205;
  	const zIndexGrid = 220;

    const NavigationStyles = {
      position: 'fixed',
      top: 80,
      height: 500,
      width: 60,
      zIndex: 30,
      backgroundColor: 'black',
      border: '1px solid #49fb35'
    };

  	return (
      <div id="map-main">
        <DataStream dataMessage={this.props.dataStream.currentItem}/>
        <SideBar />
        <SideBarController map={this.state.map}/>
    		<Map
          ref='map'
          style={{zIndex: 5}}
          center={this.props.mapCenterAndZoom.center}
          zoom={this.props.mapCenterAndZoom.zoom}
          zoomControl={false}
          onZoomend={e => this.onZoomend(e)}
          onZoomstart={e => this.onZoomstart(e)}
          onMoveend={e => this.onMoveend(e)}F
          onMovestart={e => this.onMovestart(e)}
          onDragend={e => this.onDragend(e)}
          onDragstart={e => this.onDragstart(e)}
          onMove={e => this.onMove(e)}
          onClick={(e) => this.onClickHyperspaceNavigation(e)}
          onViewportChange={e => this.onViewportChange(e)}
          onViewportChanged={e => this.onViewportChanged(e)}
        >
    			<LayersControl>
    				<BaseLayer name="Galaxy" checked={true}>
    					<Pane name="galaxy-pane" style={{ zIndex: zIndexGalaxy }}>
							 <TileLayer url={activeTileServer} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} maxZoom={maxZoom}/>
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
			    		<Regions />
			    	</Overlay>
            <Overlay name="Grid" checked={false}>
              <Grid />
            </Overlay>
  					
            <Overlay name="Hyperspace Lanes" checked={false}>
              <HyperspaceLanesData />
            </Overlay>
            <Overlay name="Hyperspace Navigation" checked={true}>
              <HyperspaceNavigation update={this.props.updateHyperspaceNavigation}/>
            </Overlay>
            
            <Overlay name="Star Systems" checked={true}  ref="layerContainer" >
              <StarMap map={this.state.map} />
            </Overlay>
  				  </LayersControl>
            <Control position="topright" >
              <button onClick={ () => console.log("Control bitch!!!") } >
                Reset View
              </button>
            </Control>
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

export default connect(mapStateToProps)(MapMain);