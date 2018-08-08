import 'whatwg-fetch';
import queryString from 'query-string';
import urlencode from 'urlencode';

import Config from 'Config';

console.log("Config: ", Config);

function apiSelector(CurrentConfig) {
	const apiPathFragment = '/api/';
	const frontEndAPIEndpoint = apiPathFragment;
	const ApiServerUrl = CurrentConfig.apiServerUrl + apiPathFragment;
	// return ApiServerUrl;

	switch (CurrentConfig.name) {
		case 'development':
			// return ApiServerUrl;
			return frontEndAPIEndpoint;
		case 'production':
			return frontEndAPIEndpoint;
		default:
			return frontEndAPIEndpoint;
	}
}

class ApiService {
	constructor() {
		this.API_ENDPOINT = apiSelector(Config);
	}

	allPlanetsWithALocation() {
		const planetsWithALocationEndpoint = this.API_ENDPOINT + 'has-location';
		return fetch(planetsWithALocationEndpoint).then(response => {
    	return response.json();
		});
	}

	findSystemByName(systemName) {
		const findSystemNameEndpoint = this.API_ENDPOINT + 'search/?system=' + urlencode(systemName);
    return fetch(findSystemNameEndpoint).then(response => {
    	return response.json();
    });
	}

	findPlanet(systemSearch) {
	  const planetQuery = this.API_ENDPOINT + 'search/?' + queryString.stringify(systemSearch);
	  return fetch(planetQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	findHyperspaceNode(nodeSearch) {
	  const nodeQuery = this.API_ENDPOINT + 'hyperspacenode/search?' + queryString.stringify(nodeSearch);
	  return fetch(nodeQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	findNearestNode(LngLatSearch) {
	  const nodeQuery = this.API_ENDPOINT + 'hyperspacenode/closet?' + queryString.stringify(LngLatSearch);
	  return fetch(nodeQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	findNearestPseudoNode(SearchPoint) {
	  const nodeQuery = this.API_ENDPOINT + 'hyperspacenode/nearest-pseudo-node?' + queryString.stringify(SearchPoint);
	  return fetch(nodeQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	findNearestNodeOfPoint(SearchPoint) {
	  const nodeQuery = this.API_ENDPOINT + 'hyperspacenode/nearest-node-to-point?' + queryString.stringify(SearchPoint);
	  return fetch(nodeQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	getHyperspacePathData(PathSearch) {
		let jumpEndpoint = this.API_ENDPOINT + 'hyperspace-jump/';
		jumpEndpoint += (PathSearch.shortest)? 'calc-shortest' : 'calc-many';
	  return fetch(jumpEndpoint, {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(PathSearch)
	  }).then(response => {
      return response.json();
    });
	}

	systemsConnected(Systems) {
	  const systemsConnectedEndpoint = this.API_ENDPOINT + 'hyperspacenode/systems-connected-query?' + queryString.stringify(Systems);
	  return fetch(systemsConnectedEndpoint, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
      return response.json();
    });
	}

	systemConnectedToCoruscant(CurrentSystem) {
	  const endpointUrl = this.API_ENDPOINT + 'hyperspacenode/connected-to-coruscant?' + queryString.stringify(CurrentSystem);
	  return fetch(endpointUrl, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
      return response.json();
    });
	}

	systemConnectedToCsilla(CurrentSystem) {
	  const endpointUrl = this.API_ENDPOINT + 'hyperspacenode/connected-to-csilla?' + queryString.stringify(CurrentSystem);
	  return fetch(endpointUrl, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
      return response.json();
    });
	}

	systemLink(CurrentSystem) {
	  const planetQuery = this.API_ENDPOINT + 'search/?' + queryString.stringify(CurrentSystem);
	  return fetch(planetQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
      return response.json();
    });
	}

	findSector(Sector) {
	  const sectorQuery = this.API_ENDPOINT + 'sector/?' + queryString.stringify(Sector);
	  return fetch(sectorQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	allHyperspaceLaneNames() {
	  const hyperspaceLaneNamesEndpoint = this.API_ENDPOINT + 'hyperspacelane/names';
	  return fetch(hyperspaceLaneNamesEndpoint, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	searchForHyperspaceRoute(Route) {
	  const routeQuery = this.API_ENDPOINT + 'hyperspacelane/build-route?' + queryString.stringify(Route);
	  return fetch(routeQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  }).then(response => {
    	return response.json();
    });
	}

	placesConnected(placesArray) {
		const placesConnectedEndpoint = this.API_ENDPOINT + 'hyperspacenode/places-connected';
	  return fetch(placesConnectedEndpoint, {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(placesArray)
	  }).then(response => {
    	return response.json();
    });
	}

	gridGeoJsonData() {
	  const gridGeoJsonEndpoint = this.API_ENDPOINT + 'data/grid';
	  return fetch(gridGeoJsonEndpoint, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    mode: 'cors'
	  }).then(response => {
    	return response.json();
    });
	}

	regionGeoJsonData() {
	  const regionGeoJsonEndpoint = this.API_ENDPOINT + 'data/region';
	  return fetch(regionGeoJsonEndpoint, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    mode: 'cors'
	  }).then(response => {
    	return response.json();
    });
	}

	sectorGeoJsonData() {
	  const sectorGeoJsonEndpoint = this.API_ENDPOINT + 'data/sector';
	  return fetch(sectorGeoJsonEndpoint, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    mode: 'cors'
	  }).then(response => {
    	return response.json();
    });
	}

	hyperspaceGeoJsonData() {
	  const hyperspaceGeoJsonEndpoint = this.API_ENDPOINT + 'data/hyperspace';
	  return fetch(hyperspaceGeoJsonEndpoint, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    mode: 'cors'
	  }).then(response => {
    	return response.json();
    });
	}

}

export default new ApiService();
