import omit from 'object.omit';
import Geohash from 'latlon-geohash';
import _ from 'lodash';


import {
  getGalacticYFromLatitude,
  getGalacticXFromLongitude
} from '../components/hyperspaceNavigation/hyperspaceMethods.js';


export default class Place {
  constructor(Options) {
  	this.systemSearch = false;
  	this.latLngSearch = false;
  	this.isStartPosition = Options.isStartPosition;
  	this.emptySpace = (Options.emptySpace)? true : false;
  	const placeKeys = Object.keys(Options);
  	if(placeKeys.indexOf('system') > -1) {
  		this.system = Options.system;
  		this.systemSearch = true;
  	}

  	if(placeKeys.indexOf('lat') > -1 && placeKeys.indexOf('lng') > -1) {
  		this.lat = Options.lat;
  		this.lng = Options.lng;
  		this.latLngSearch = true;
  	}
  }

  searchQuery() {
  	if(this.systemSearch) {
  		return {
  			system: this.system
  		};
  	}
  	if(this.latLngSearch) {
  		return {
  			lat: this.lat,
  			lng: this.lng
  		};
  	}
  	return {};
  }

  emptySpaceName() {
  	if(this.emptySpace) {
	    let emptySpaceGeoHash = Geohash.encode(this.lat, this.lng, 22);
	    const upperCaseGeoHashShort = emptySpaceGeoHash.toUpperCase().slice(0,7);
	    return 'Empty Space ' + upperCaseGeoHashShort;
  	} else {
  		return this.system;
  	}
  }

  positionState() {
		const nameHash = this.emptySpaceName();
    const xGalacticLong = getGalacticXFromLongitude(this.lng);
    const yGalacticLong = getGalacticYFromLatitude(this.lat);
    const xGalactic = xGalacticLong.toFixed(2);
    const yGalactic = yGalacticLong.toFixed(2);
    const NewPositionState = {
      system: nameHash,
      lat: this.lat,
      lng: this.lng,
      xGalacticLong: xGalacticLong,
      yGalacticLong: yGalacticLong,
      xGalactic: xGalactic,
      yGalactic: yGalactic,
      zoom: 10,
      emptySpace: true,
      link: '',
      sector: [null],
      region: '',
      coordinates: 'Unknown'
    };
    return NewPositionState;
  }


};