import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
import _ from 'lodash';
import Geohash from 'latlon-geohash';

import StarMapGenerator from '../../classes/starMapGenerator.js';
import GalaxyDataGenerator from '../../classes/galaxyDataGenerator.js';
import NavigationPoints from '../../classes/navigationPoints.js';
import Logger from '../../classes/logger.js';
import ApiService from '../../remoteServices/apiService.js';


const LoggerInstance = new Logger();
LoggerInstance.setInActive();

import StarSystem from './starSystem.js';
import {
  updateSouthWestMapHash,
  updateNorthEastMapHash,
  buildSystemNameSet,
  loadingIconOff
} from '../../actions/actionCreators.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


class StarMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StarMapComponents: [],
      GalacticPlanetsArray: [],
      previousIntersectionMap: new Set(),
      zoom: 2,
      northEast: null,
      southWest: null
    };
  }

  componentDidMount() {
  	ApiService.allPlanetsWithALocation().then(PlanetData => {
      const GalaxyData = new GalaxyDataGenerator(PlanetData);
      this.setState({GalacticPlanetsArray: GalaxyData.PlanetsArray});
      const currentMapZoom = this.props.map.getZoom();
      const MapBoundariesHashes = getNorthEastAndSoutWestBounds(this.props.map);
      const CurrentNavigationPoints = new NavigationPoints({changeInPoints: false});
      this.createStarMapAndSetState(currentMapZoom, this.props.map, MapBoundariesHashes, CurrentNavigationPoints);
      this.props.dispatch(buildSystemNameSet(GalaxyData.systemNameSet));
  	});
  }

  createStarMap(currentZoom, currentMap, NavPoints) {
    LoggerInstance.log("\n****StarMap creation!****");
    LoggerInstance.time('Star Map Generation Time');
    const filteredGalacticPlanetsArray = NavPoints.filteredPlanetsArray(this.state.GalacticPlanetsArray);
    const CurrentStarMap = new StarMapGenerator({
      zoom: currentZoom,
      Map: currentMap
    });
    const StellarData = CurrentStarMap.generateStellarArrays(currentMap, filteredGalacticPlanetsArray, this.state.previousIntersectionMap, this.state.StarMapComponents);
    LoggerInstance.log("Systems Generated for Star Map: " + StellarData.starComponents.length);
    LoggerInstance.timeEnd('Star Map Generation Time');
    LoggerInstance.log("****StarMap finished!****\n");
    return StellarData;
  }

  setStarMapState(StarMapData, zoom, MapHashes) {
    this.setState({zoom: zoom});
    this.setState({StarMapComponents: StarMapData.starComponents});
    this.setState({northEast: MapHashes.northEast});
    this.setState({southWest: MapHashes.southWest});
    this.setState({previousIntersectionMap: StarMapData.intersectionMap});
    this.props.dispatch(loadingIconOff());
    this.props.dispatch(updateNorthEastMapHash(MapHashes.northEast));
    this.props.dispatch(updateSouthWestMapHash(MapHashes.southWest));
  }

  createStarMapAndSetState(zoomInStore, mapInstance, MapHashes, NavPoints) {
    const StarMapData = this.createStarMap(zoomInStore, mapInstance, NavPoints);
    this.setStarMapState(StarMapData, zoomInStore, MapHashes);    
  }

  starMapGeneratorController(zoomInStore, mapInstance, NavPoints) {
    const MapHashes = getNorthEastAndSoutWestBounds(mapInstance);
    const differentNorthEastPoint = MapHashes.northEast !== this.state.northEast;
    const differentSouthWestPoint = MapHashes.southWest !== this.state.southWest;
    const mapBoundsHaveChanged = differentNorthEastPoint && differentSouthWestPoint;
    const northEastLat = MapHashes.NorthEastBounds.lat;
    const northEastLng = MapHashes.NorthEastBounds.lng;
    const southWestLat = MapHashes.SouthWestBounds.lat;
    const southWestLng = MapHashes.SouthWestBounds.lng;
    const galaxyLatitudeView = galaxyLevelLatitude(northEastLat) && galaxyLevelLatitude(southWestLat);
    const galaxyLongitudeView = galaxyLevelLongitude(northEastLng) && galaxyLevelLongitude(southWestLng);
    const galaxyLevelBounds = (galaxyLatitudeView && galaxyLongitudeView);

    if(zoomInStore === 2 && galaxyLevelBounds && this.state.zoom !== 2) {
      this.createStarMapAndSetState(zoomInStore, mapInstance, MapHashes, NavPoints);
    } else if(this.state.zoom !== zoomInStore && mapBoundsHaveChanged) {
      this.createStarMapAndSetState(zoomInStore, mapInstance, MapHashes, NavPoints);
    } else if(zoomInStore !== 2 && this.state.zoom !== 3 && mapBoundsHaveChanged) {
      this.createStarMapAndSetState(zoomInStore, mapInstance, MapHashes, NavPoints);
    } else if(NavPoints.changeInPoints) {
      this.createStarMapAndSetState(zoomInStore, mapInstance, MapHashes, NavPoints);
    }
  }

  componentWillReceiveProps(newProps) {
    const startPointDifferent = (newProps.StartPoint.system !== this.props.StartPoint.system)? true : false;
    const endPointDifferent = (newProps.EndPoint.system !== this.props.EndPoint.system)? true : false;
    const activeStartPointDifferent = (newProps.ActiveStartPoint.system !== this.props.ActiveStartPoint.system)? true : false;
    const activeEndPointDifferent = (newProps.ActiveEndPoint.system !== this.props.ActiveEndPoint.system)? true : false;
    const changeInSearchPoints = (startPointDifferent || endPointDifferent)? true : false;
    const changeInActivePoints = (activeStartPointDifferent || activeEndPointDifferent)? true : false;
    const changeInActiveSystem = (newProps.ActiveSystem.system !== this.props.ActiveSystem.system)? true : false;
    const changeInPoints = (changeInSearchPoints || changeInActivePoints || changeInActiveSystem)? true : false;

    if((changeInPoints && newProps.starMapOn) || newProps.starMapOn) {
      const zoomInStore = newProps.mapCenterAndZoom.zoom;
      const mapInstance = newProps.map;
      const CurrentNavigationPoints = new NavigationPoints({
        StartPoint: newProps.StartPoint,
        EndPoint: newProps.EndPoint,
        ActiveStartPoint: newProps.ActiveStartPoint,
        ActiveEndPoint: newProps.ActiveEndPoint,
        ActiveSystem: newProps.ActiveSystem,
        changeInPoints: changeInPoints
      });
      this.starMapGeneratorController(zoomInStore, mapInstance, CurrentNavigationPoints);
    }
  }    

  render() {
  	const zIndex = 270;
    const StarMapComponentsToRender = renderComponentsOrNull(this.state.StarMapComponents);

  	return (
  		<Pane name="star-pane" style={{zIndex: zIndex}}>
  			<FeatureGroup  onZoomend={e => this.onZoomend(e)}>  
          { StarMapComponentsToRender }
  			</FeatureGroup>
  		</Pane>
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

function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}

function galaxyLevelLatitude(latitude) {
  return (Math.abs(latitude) > 80.0)? true : false;
}

function galaxyLevelLongitude(longitude) {
  return (Math.abs(longitude) > 170.0)? true : false;
}

const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(StarMap);