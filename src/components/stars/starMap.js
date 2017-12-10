import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import _ from 'lodash';
import Geohash from 'latlon-geohash';

import { Planet, HyperSpaceLane } from '../../classes/stellarClasses.js';
import StarSystem from './starSystem.js';
import { 
  zoomChangeStatus,
  viewShouldStayTheSame,
  updateSouthWestMapHash,
  updateNorthEastMapHash,
  buildSystemNameSet
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
  	fetch('/api/has-location')  
		.then(response => {
	    	return response.json();
		}).then(data => {
      const StarData = JSON.parse(data);
      const PlanetsArray = [];
      let systemNamesArray = [];
  		for(let i=0; i < StarData.length; i++) {
        let textWidth = width(StarData[i].system, { size: "1em" });
        textWidth +=  0.5;
        const currentStar = StarData[i];
        delete currentStar.__v;
        if(currentStar.system !== null) {
          const CurrentSystem = new Planet(
            currentStar.system,
            currentStar.sector,
            currentStar.region,
            currentStar.coordinates,
            currentStar.xGalactic,
            currentStar.yGalactic,
            currentStar.xGalacticLong,
            currentStar.yGalacticLong,
            currentStar.hasLocation,
            currentStar.LngLat,
            currentStar.lat,
            currentStar.lng,
            currentStar.zoom,
            currentStar.link,
            textWidth
          );
          PlanetsArray.push(CurrentSystem);
          systemNamesArray.push({label: currentStar.system, value: currentStar.system});
        }
  		}

      this.setState({GalacticPlanetsArray: PlanetsArray});
      systemNamesArray.sort(function(a, b){
        const systemA = a.value.toLowerCase();
        const systemB = b.value.toLowerCase();
        if(systemA < systemB) return -1;
        if(systemA > systemB) return 1;
        return 0;
      });

      let systemNameSetSorted = new Set(systemNamesArray);
      const SystemNamesSetFrozen = Object.freeze(systemNameSetSorted);
      this.props.dispatch(buildSystemNameSet(SystemNamesSetFrozen));

      const currentMapZoom = this.props.map.getZoom();
      const MapBoundariesHashes = getNorthEastAndSoutWestBounds(this.props.map);
      this.createStarMapAndSetState(currentMapZoom, this.props.map, MapBoundariesHashes);
  	});
  }

  createStarMap(currentZoom, currentMap) {
    console.log("\n****StarMap creation!****");
    // console.log("Zoom on map: ", currentMap.getZoom());
    // console.log("Zoom on mapCenterAndZoom.zoom: ", currentZoom);
    // console.log("Map zoom matchup: ", currentZoom === currentMap.getZoom());
    const intersectionMap = generateIntersectionMap(
      currentZoom,
      currentMap,
      this.state.GalacticPlanetsArray
    );
    const StellarArrays = generateStellarArrays(
      currentZoom,
      currentMap,
      intersectionMap,
      this.state.previousIntersectionMap,
      this.state.StarMapComponents
    );
    const starSystemSet = new Set(StellarArrays.starSystemArray);
    const StarComponents = StellarArrays.stellarComponentsArray;
    // let intersectionOnCreation = new Set([...starSystemSet].filter(x => intersectionMap.has(x)));
    // let unionOnCreation = new Set([...starsInViewSet, ...intersectionMap]);
    // console.log("intersection of two sets: ", intersectionOnCreation);
    // console.log("intersectionMap from above: ", intersectionMap.size);
    // console.log("star maps equal: ", eqSet(intersectionMap, starSystemSet));
    console.log("Systems Generated for Star Map: ", StellarArrays.stellarComponentsArray.length);
    console.log("****StarMap finished!****\n");
    return {
      StarComponents,
      intersectionMap
    };
  }

  starMapGeneratorController(zoomInStore, mapInstance) {
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
      // console.log("Pepsi!! Generating Star Map at Galaxy Level");
      this.createStarMapAndSetState(zoomInStore, mapInstance, MapHashes);
    } else if(this.state.zoom !== zoomInStore && mapBoundsHaveChanged) {
      // console.log("Pepsi!! Generating Star Map as bounds and zoom are different");
      this.createStarMapAndSetState(zoomInStore, mapInstance, MapHashes);
    } else if(zoomInStore !== 2 && this.state.zoom !== 3 && mapBoundsHaveChanged) {
      // console.log("Pepsi!! Generating Star Map as map view has changed");
      this.createStarMapAndSetState(zoomInStore, mapInstance, MapHashes);
    } else if(!mapBoundsHaveChanged) {
      // console.log("Pepsi!! Map Bounds have not changed, Star map is not rebuilding!");
    } else {
      // console.log("Pepsi!! Star map is not rebuilding for some unknow reason!");      
    }

    if(mapBoundsHaveChanged) {
      // console.log("Pepsi!! Map Bounds have changed: ", MapHashes);
    } else {
      // console.log("Pepsi!! Map Bounds have not changed: ", MapHashes);
    }
  }

  createStarMapAndSetState(zoomInStore, mapInstance, MapHashes) {
      const StarMapData = this.createStarMap(zoomInStore, mapInstance);
      this.setStarMapState(StarMapData, zoomInStore, MapHashes);    
  }

  setStarMapState(StarMapData, zoom, MapHashes) {
    this.setState({zoom: zoom});
    this.setState({StarMapComponents: StarMapData.StarComponents});
    this.setState({northEast: MapHashes.northEast});
    this.setState({southWest: MapHashes.southWest});
    this.setState({previousIntersectionMap: StarMapData.intersectionMap})
    this.props.dispatch(updateNorthEastMapHash(MapHashes.northEast));
    this.props.dispatch(updateSouthWestMapHash(MapHashes.southWest));
  }

  componentWillReceiveProps(newProps) {
    // console.log("\n\nProps update StarMap: ", newProps);
    // console.log("this.props: ", this.props);
    // const mapZoom = this.props.map.getZoom();
    const zoomInStore = newProps.mapCenterAndZoom.zoom;
    const mapInstance = newProps.map;
    // console.log("mapZoom: ", mapZoom);
    // console.log("zoomInStore: ", zoomInStore);
    // console.log("this.state.zoom: ", this.state.zoom);

    this.starMapGeneratorController(zoomInStore, mapInstance);
  }    

  render() {
  	const zIndex = 270;
    const StarMapComponentsToRender = renderComponentsOrNull(this.state.StarMapComponents);
    // console.log("Total Star Components Rendering: ", (this.state.StarMapComponents)? this.state.StarMapComponents.length : null);

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
    }
}

function generateStellarArrays(currentZoom, currentMap, intersectionMap, previousIntersectionMap, currentStarMapComponents) {
  const starSystemArray = [];
  let stellarComponentsArray = [];
  const starMapsEqual = eqSet(intersectionMap, previousIntersectionMap);
  // console.log("Equal to previous star maps: ", starMapsEqual);
  if( !starMapsEqual || (previousIntersectionMap.size === 0 ) ) {
    intersectionMap.forEach(function(PlanetarySystem, sameItem) {
      if(!PlanetarySystem.hasOwnProperty('latLng')) {
        if(PlanetarySystem.lat === null && PlanetarySystem.lng === null) {
          PlanetarySystem.latLng = [PlanetarySystem.lat, PlanetarySystem.lng];
          // console.log("currentStar data has lat: ", currentStarData.lat);
          const starLngLat = PlanetarySystem.LngLat;
          const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
          // console.log("currentLatLng: ", currentLatLng);
          PlanetarySystem['lat'] = currentLatLng[1];
          PlanetarySystem['lng'] = currentLatLng[0];
          PlanetarySystem[i].latLng = currentLatLng;

        } else {
          const currentLatLng = L.latLng(PlanetarySystem.lat, PlanetarySystem.lng);
          // console.log("currentLatLng: ", currentLatLng);
          PlanetarySystem.latLng = currentLatLng;
        }
      }
      const StarPoints = currentMap.latLngToLayerPoint(PlanetarySystem.latLng);
      // console.log("PlanetarySystem: " + typeof PlanetarySystem);
      stellarComponentsArray.push( <StarSystem key={PlanetarySystem.system} StarObject={PlanetarySystem} zoom={currentZoom} map={currentMap} labels={true} StarPoints={StarPoints} /> );
      starSystemArray.push(PlanetarySystem);
    });  
  } else {
    // console.log("star components: ", this.state.StarMapComponents);
    stellarComponentsArray = currentStarMapComponents;
  }
  return {
    starSystemArray: starSystemArray,
    stellarComponentsArray: stellarComponentsArray
  }
}

function getMapBoundaries(currentZoom, currentMap) {
  const CurrentMapBoundaries = currentMap.getBounds();
  const mapWidth = CurrentMapBoundaries._northEast.lng - CurrentMapBoundaries._southWest.lng;
  const mapHeight = CurrentMapBoundaries._northEast.lat - CurrentMapBoundaries._southWest.lat;
  let mapPaddingHeight = 0;
  let mapPaddingWidth = 0;
  if (currentZoom <= 2) {
    // console.log("Leaving Bounds!");
  } else if (currentZoom === 3){
    mapPaddingWidth = 50;
    mapPaddingHeight = 25;
  } else if (currentZoom == 4) {
    mapPaddingWidth = 10;
    mapPaddingHeight = 5;
  }
  const mapOffSetLat = mapPaddingHeight;
  const mapOffSetLng = mapPaddingWidth;
  const southernBoundary = CurrentMapBoundaries._southWest.lat - mapOffSetLat;
  const northernBoundary = CurrentMapBoundaries._northEast.lat + mapOffSetLat
  const westernBoundary = CurrentMapBoundaries._southWest.lng - mapOffSetLng;
  const easternBoundary = CurrentMapBoundaries._northEast.lng + mapOffSetLng;
  const MapBoundaries = {
    north: northernBoundary,
    south: southernBoundary,
    east: easternBoundary,
    west: westernBoundary,
    mapWidth: mapWidth,
    mapHeight: mapHeight
  };
  // console.log("MapBoundaries: ", MapBoundaries);
  // console.log("northernBoundary: ", northernBoundary);
  // console.log("southernBoundary: ", southernBoundary);
  // console.log("easternBoundary: ", easternBoundary);
  // console.log("westernBoundary: ", westernBoundary);
  return MapBoundaries;
}

function generateIntersectionMap(currentZoom, currentMap, galacticPlanetsArray) {

  const MapBoundaries = getMapBoundaries(currentZoom, currentMap);
  let starsCurrentlyInView = _.filter(galacticPlanetsArray, e => { 
    return e.starInMapView(
      MapBoundaries.mapWidth,
      MapBoundaries.mapHeight,
      MapBoundaries,
      currentZoom
    ) === true; 
  });
  let starsCurrentlyVisible = _.filter(galacticPlanetsArray, e => { 
    // console.log("Star is currently in view: ", e);
    // console.log("starVisible: ", starVisible);
    return e.starIsVisible(currentZoom) === true; 
  });
  const starsInViewSet = new Set(starsCurrentlyInView);
  const starsVisible = new Set(starsCurrentlyVisible);
  // const union = new Set([...starsInViewSet, ...starsVisible]);
  const intersectionMap = (currentZoom > 3)? new Set([...starsInViewSet].filter(x => starsVisible.has(x))) : new Set([...starsVisible]);
  // console.log("starsCurrentlyInView: ", starsCurrentlyInView);
  // console.log("starsAtZoomLevel: ", starsAtZoomLevel);
  // console.log("starsCurrentlyVisible: ", starsCurrentlyVisible);
  // console.log("starsInViewSet: ", starsInViewSet);
  // console.log("starsVisible: ", starsVisible);
  // console.log("union: ", union);
  // console.log("intersectionMap: ", intersectionMap);
  // console.log("intersectionMapDuo: ", intersectionMapDuo);
  // console.log("previousIntersectionMap: ", this.state.previousIntersectionMap);
  return intersectionMap;
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

function eqSet(as, bs) {
  return as.size === bs.size && all(isIn(bs), as);
}

function all(pred, as) {
  for (var a of as) if (!pred(a)) return false;
    return true;
}

function isIn(as) {
  return function (a) {
    return as.has(a);
  };
}

const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(StarMap);