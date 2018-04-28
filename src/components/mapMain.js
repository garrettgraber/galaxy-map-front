import React from 'react';
import { connect } from 'react-redux';
import Control from 'react-leaflet-control';
import { Map, TileLayer, LayersControl, Pane, LayerGroup, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import Geohash from 'latlon-geohash';
import ScrollArea from 'react-scrollbar';

import Logger from '../classes/logger.js';

const LoggerInstance = new Logger();
LoggerInstance.setInActive();

import Config from 'Config';
const activeTileServer = Config.tileServerUrl;

LoggerInstance.log(Config);

import {
    setMapCenterAndZoom,
    updateNorthEastMapHash,
    updateSouthWestMapHash,
    setMapZoom,
    loadingIconOn,
    loadingIconOff,
    starMapIsOn,
    starMapIsOff,
    sectorMapIsOn,
    sectorMapIsOff
} from '../actions/actionCreators.js';
import {
  setCursorValue,
  buildHyperspaceLaneNamesSet,
  setHyperspaceNavigationPoints,
  changeBaseLayer
} from '../actions/actions.js';

const { BaseLayer, Overlay } = LayersControl;

import Grid from './grid/grid.js';
import Regions from './regions/regions.js';
import Sectors from './sectors/sectors.js';
import HyperspaceLanesData from './hyperspaceData/hyperspaceLanesData.js';
import StarMap from './stars/starMap.js';
import SideBarController from './sideBar/sideBarController.js';
import SideBar from './sideBar/sideBar.js';
import DataStream from './dataStream/dataStream.js';
import MapNavigationControl from './mapNavigationControls/mapNavigationControl.js';
import LoadingSpinner from './loading/loadingSpinner.js';
import HyperspaceNavigation from './hyperspaceNavigation/hyperspaceNavigation.js';
import Search from './search/search.js';
import Place from '../classes/place.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

import imgBlack from '../images/black-tile.png';
import imgWhite from '../images/white-tile.png';
const blackTileImage = imgBlack;
const whiteTileImage = imgWhite;

class MapMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	map: null
    }
  }

  componentDidMount() {
  	const mapBounds = this.refs.map.leafletElement.getBounds();
  	const currentZoom = this.refs.map.leafletElement.getZoom();
  	this.refs.map.leafletElement.setMaxBounds(mapBounds);
  	if(this.refs.map) {
      console.log("Map: ", this.refs.map.leafletElement);
  		this.setState({map: this.refs.map.leafletElement});
  	}
    this.props.dispatch(setMapZoom(currentZoom));
    this.props.dispatch(setCursorValue());
    this.props.dispatch(buildHyperspaceLaneNamesSet());
  }

  componentWillReceiveProps(newProps) {
    this.props.dispatch(setCursorValue());
  }

  onZoomend(e) {
    console.log("zoom end: ", e.target._zoom);
    const mapBounds = this.refs.map.leafletElement.getBounds();
    const currentZoom = this.refs.map.leafletElement.getZoom();
    if(!(currentZoom === 2 && this.props.mapCenterAndZoom.zoom === 3)) {
      this.props.dispatch(setMapZoom(currentZoom));
    }
  }

  onZoomstart(e) {
    console.log("zoom start: ", e.target._zoom);
  }

  onMovestart(e) {
    this.props.dispatch(loadingIconOn());
  }

  onMoveend(e) {
    const mapInstance = this.refs.map.leafletElement;
    const MapBounds = getNorthEastAndSoutWestBounds(mapInstance);
    const northEastMapBoundsDifferent = MapBounds.northEast !== this.props.northEastMapHash;
    const southWestMapBoundsDifferent = MapBounds.southWest !== this.props.southWestMapHash;
    if(northEastMapBoundsDifferent || southWestMapBoundsDifferent) {
      this.props.dispatch(updateNorthEastMapHash(MapBounds.northEast));
      this.props.dispatch(updateSouthWestMapHash(MapBounds.southWest));
    }
    this.props.dispatch(loadingIconOff());
  }

  onDragend(e) { }

  onDragstart(e) { }

  onMove(e) { }

  onMouseMove(e) { }

  onClickHyperspaceNavigation(e) {
    if(this.props.pathSearchEnd || this.props.pathSearchStart) {
      const isStartPosition = (this.props.pathSearchStart)? true : false;
      const SearchPlace = new Place({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        emptySpace: true,
        isStartPosition: isStartPosition
      });
      this.props.dispatch(setHyperspaceNavigationPoints(SearchPlace));
    } else {
      return null;
    }
  }

  onViewportChange(ViewportValues) { }

  onViewportChanged(ViewportValues) {
    const mapBounds = this.refs.map.leafletElement.getBounds();
    this.props.dispatch(setMapCenterAndZoom(
      ViewportValues.center,
      ViewportValues.zoom
    ));
  }

  onClickStarMapOverlay(e) {
    console.log("onClickStarMapOverlay has fired...");
  }

  onOverlayadd(e) {
    if(e.name === 'Star Systems') {
      this.props.dispatch(starMapIsOn());
    } else if(e.name === 'Sectors') {
      this.props.dispatch(sectorMapIsOn());
    }
    // console.log("e.name added: ", e.name);
  }

  onBaselayerchange(e) {
    // console.log("baselayer change: ", e);
    this.props.dispatch(changeBaseLayer(e.name));
  }

  onOverlayremove(e) {
    if(e.name === 'Star Systems') {
      this.props.dispatch(starMapIsOff());
    } else if(e.name === 'Sectors') {
      this.props.dispatch(sectorMapIsOff());
    }

    // console.log("e.name removed: ", e.name);
  }

  render() {
  	const minZoom = 2;
  	const maxZoom = 8;
  	const zIndexGalaxy = 210;
    const zIndexBlack = 205;
    const zIndexWhite = 204;

    if(this.refs.map) {
      const LeafletMap = this.refs.map;
      // console.log("LeafletMap: ", LeafletMap);
    }

  	return (
      <ScrollArea
        onScroll={(value) => { }}
      >
        <div id="container" >
          <LoadingSpinner/>
          <DataStream dataMessage={this.props.dataStream.currentItem}/>
          <SideBar />
          <SideBarController map={this.state.map}/>
          <MapNavigationControl  map={this.state.map}/>
      		<Map
            ref='map'
            style={{zIndex: 5}}
            center={this.props.mapCenterAndZoom.center}
            zoom={this.props.mapCenterAndZoom.zoom}
            zoomControl={false}
            animate={true}
            onZoomend={e => this.onZoomend(e)}
            onZoomstart={e => this.onZoomstart(e)}
            onMoveend={e => this.onMoveend(e)}
            onMovestart={e => this.onMovestart(e)}
            onDragend={e => this.onDragend(e)}
            onDragstart={e => this.onDragstart(e)}
            onMove={e => this.onMove(e)}
            onMouseMove={e => this.onMouseMove(e)}
            onClick={(e) => this.onClickHyperspaceNavigation(e)}
            onViewportChange={e => this.onViewportChange(e)}
            onViewportChanged={e => this.onViewportChanged(e)}
            onOverlayadd={e => this.onOverlayadd(e)}
            onOverlayremove={e => this.onOverlayremove(e)}
            onBaselayerchange={e => this.onBaselayerchange(e)}
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
              <BaseLayer name="White" checked={false} >
                <Pane name="white-pane" style={{ zIndex: zIndexWhite }}>
                  <TileLayer url={whiteTileImage} tms={true} crs={L.CRS.Simple} maxBoundsViscosity={1.0} minZoom={minZoom} />
                </Pane>
              </BaseLayer>
              <Overlay name="Sectors" checked={this.props.sectorMapOverlayStatus}>
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
              <Overlay name="Search Layer" checked={true}>
                <Search  map={this.state.map}/>
              </Overlay>
              <Overlay name="Hyperspace Navigation" checked={true}>
                <HyperspaceNavigation update={this.props.updateHyperspaceNavigation} newZoom={this.props.mapCenterAndZoom.zoom} starMapOn={this.props.starMapOverlayStatus}/>
              </Overlay>
              <Overlay name="Star Systems" checked={this.props.starMapOverlayStatus} ref="layerContainer" >
                <StarMap
                  map={this.state.map}
                  starMapOn={this.props.starMapOverlayStatus}
                  StartPoint={this.props.hyperspaceStartPoint}
                  EndPoint={this.props.hyperspaceEndPoint}
                  ActiveStartPoint={this.props.hyperspaceActiveStartPoint}
                  ActiveEndPoint={this.props.hyperspaceActiveEndPoint}
                  ActiveSystem={this.props.activeSystem}
                />
              </Overlay>
  				  </LayersControl>
      		</Map>
        </div>
      </ScrollArea>
  	)
  }
}


function getNorthEastAndSoutWestBounds(mapInstance) {
  const CurrentMapBoundaries = mapInstance.getBounds();
  const NorthEastBounds = CurrentMapBoundaries._northEast;
  const SouthWestBounds = CurrentMapBoundaries._southWest;
  const northEastGeoHash = Geohash.encode(NorthEastBounds.lat, NorthEastBounds.lng, 20);
  const southWestGeoHash = Geohash.encode(SouthWestBounds.lat, SouthWestBounds.lng, 20);   
  return {
    northEast: northEastGeoHash,
    southWest: southWestGeoHash,
    NorthEastBounds: NorthEastBounds,
    SouthWestBounds: SouthWestBounds
  };
}

function getGalacticYFromLatitude(latitude) {
  return  (-3.07e-19*(latitude**12)) + (-1.823e-18*(latitude**11)) + (4.871543e-15*(latitude**10)) + (4.1565807e-14*(latitude**9)) + (-2.900986202e-11 * (latitude**8)) + (-1.40444283864e-10*(latitude**7)) + (7.9614373223054e-8*(latitude**6)) + (7.32976568692443e-7*(latitude**5)) + (-0.00009825374539548058*(latitude**4)) + (0.005511093818675318*(latitude**3)) + (0.04346753629461727 * (latitude**2)) + (111.30155374684914 * latitude);
}

function getGalacticXFromLongitude(longitude) {
  return (111.3194866138503 * longitude);
}

function getGalacticFromLatLng(LatLng) {
  return {
    yGalactic: getGalacticYFromLatitude(LatLng.lat),
    xGalactic: getGalacticXFromLongitude(LatLng.lng)
  };
}

const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(MapMain);