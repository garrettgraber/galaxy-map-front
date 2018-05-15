import React from 'react';
import _ from 'lodash';

import StarSystem from '../components/stars/starSystem.js';

export default class StarMapGenerator {
	constructor(StarMapOptions) {
		this.zoom = StarMapOptions.zoom;
		this.MapBoundaries = getMapBoundaries(this.zoom, StarMapOptions.Map);
	}

	generateIntersectionMap(galacticPlanetsArray) {
	  let starsCurrentlyInView = _.filter(galacticPlanetsArray, e => { 
	    return e.starInMapView(
	      this.MapBoundaries.mapWidth,
	      this.MapBoundaries.mapHeight,
	      this.MapBoundaries,
	      this.zoom
	    ) === true; 
	  });
	  let starsCurrentlyVisible = _.filter(galacticPlanetsArray, e => { 
	    return e.starIsVisible(this.zoom) === true; 
	  });
	  const starsInViewSet = new Set(starsCurrentlyInView);
	  const starsVisible = new Set(starsCurrentlyVisible);
	  const intersectionMap = (this.zoom > 3)? new Set([...starsInViewSet].filter(x => starsVisible.has(x))) : new Set([...starsVisible]);
	  return intersectionMap;
	}

	generateStellarArrays(currentMap, galacticPlanetsArray, previousIntersectionMap, currentStarMapComponents) {
	  const zoom = this.zoom;
	  let starComponents = [];
		const intersectionMap = this.generateIntersectionMap(galacticPlanetsArray);
	  const starMapsEqual = eqSet(intersectionMap, previousIntersectionMap);
	  if( !starMapsEqual || (previousIntersectionMap.size === 0 ) ) {
	    intersectionMap.forEach(function(PlanetarySystem) {
	      if(!PlanetarySystem.hasOwnProperty('latLng')) {
	        if(PlanetarySystem.lat === null && PlanetarySystem.lng === null) {
	          PlanetarySystem.latLng = [PlanetarySystem.lat, PlanetarySystem.lng];
	          const starLngLat = PlanetarySystem.LngLat;
	          const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
	          PlanetarySystem['lat'] = currentLatLng[1];
	          PlanetarySystem['lng'] = currentLatLng[0];
	          PlanetarySystem[i].latLng = currentLatLng;
	        } else {
	          const currentLatLng = L.latLng(PlanetarySystem.lat, PlanetarySystem.lng);
	          PlanetarySystem.latLng = currentLatLng;
	        }
	      }
	      const StarPoints = currentMap.latLngToLayerPoint(PlanetarySystem.latLng);
	      starComponents.push( <StarSystem key={PlanetarySystem.system} StarObject={PlanetarySystem} zoom={zoom} labels={true} StarPoints={StarPoints} /> );
	    });  
	  } else {
	    starComponents = currentStarMapComponents;
	  }
	  return {
	    intersectionMap,
	    starComponents
	  };
	}
};


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
	return {
    north: northernBoundary,
    south: southernBoundary,
    east: easternBoundary,
    west: westernBoundary,
    mapWidth: mapWidth,
    mapHeight: mapHeight
  };
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