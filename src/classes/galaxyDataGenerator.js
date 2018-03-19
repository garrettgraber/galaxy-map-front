import _ from 'lodash';
import width from 'text-width';

import Planet from './planet.js';
import Logger from '../classes/logger.js';

const LoggerInstance = new Logger();
LoggerInstance.setInActive();


export default class GalaxyDataGenerator {
	constructor(StarData) {
		LoggerInstance.time("Planet Array Build Time");
		this.PlanetsArray = this.buildPlanetArray(StarData);
		LoggerInstance.timeEnd("Planet Array Build Time");
		LoggerInstance.log("PlanetsArray length: ", this.PlanetsArray.length);
		this.systemNameSet = this.buildSystemNamesSet(this.PlanetsArray);
	}

	buildSystemNamesSet(PlanetsArray) {
		LoggerInstance.time("System Names Set Build Time");
	  let systemNamesArray = _.map(PlanetsArray, CurrentStar => {
      return { label: CurrentStar.system, value: CurrentStar.system };
	  }).sort(function(a, b){
	    const systemA = a.value.toLowerCase();
	    const systemB = b.value.toLowerCase();
	    if(systemA < systemB) return -1;
	    if(systemA > systemB) return 1;
	    return 0;
	  });
	  const frozenSystemNamesSet = Object.freeze(new Set(systemNamesArray));
		LoggerInstance.timeEnd("System Names Set Build Time");
		return frozenSystemNamesSet;
	}

	buildPlanetArray(StarData) {
	  const PlanetsArray = _.map(StarData, CurrentStar => {
	    let textWidth = width(CurrentStar.system, { size: "1em" }) + 0.5;
	    if(CurrentStar.system !== null) {
	      return new Planet(
	        CurrentStar.system,
	        CurrentStar.sector,
	        CurrentStar.region,
	        CurrentStar.coordinates,
	        CurrentStar.xGalactic,
	        CurrentStar.yGalactic,
	        CurrentStar.xGalacticLong,
	        CurrentStar.yGalacticLong,
	        CurrentStar.hasLocation,
	        CurrentStar.LngLat,
	        CurrentStar.lat,
	        CurrentStar.lng,
	        CurrentStar.zoom,
	        CurrentStar.link,
	        textWidth
	      );
	    } else {
	      console.log("Null system found: ", CurrentStar);
	      return {};
	    }
	  });
	  return _.filter(PlanetsArray, el => { return !(_.isEmpty(el)) });
	}
};