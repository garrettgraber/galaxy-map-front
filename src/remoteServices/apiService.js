import 'whatwg-fetch';
import queryString from 'query-string';
import urlencode from 'urlencode';

class ApiService {
	constructor() {
		this.API_ENDPOINT = '/api/';
	}

	findSystemByName(systemName) {
    return fetch(this.API_ENDPOINT + 'search/?system=' + urlencode(systemName)).then(response => {
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
	  });
	}

	findHyperspaceNode(nodeSearch) {
	  const nodeQuery = this.API_ENDPOINT + 'hyperspacenode/search?' + queryString.stringify(nodeSearch);
	  return fetch(nodeQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  });
	}

	findNearestNode(LngLatSearch) {
	  const nodeQuery = this.API_ENDPOINT + 'hyperspacenode/closet?' + queryString.stringify(LngLatSearch);
	  return fetch(nodeQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
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
	  });
	}

	systemsConnected(Systems) {
	  const systemsConnectedEndpoint = this.API_ENDPOINT + 'hyperspacenode/systems-connected-query?' + queryString.stringify(Systems);
	  return fetch(systemsConnectedEndpoint, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  });
	}

	systemConnectedToCoruscant(CurrentSystem) {
	  const endpointUrl = this.API_ENDPOINT + 'hyperspacenode/connected-to-coruscant?' + queryString.stringify(CurrentSystem);
	  return fetch(endpointUrl, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  });
	}

	systemConnectedToCsilla(CurrentSystem) {
	  const endpointUrl = this.API_ENDPOINT + 'hyperspacenode/connected-to-csilla?' + queryString.stringify(CurrentSystem);
	  return fetch(endpointUrl, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  });
	}

	systemLink(CurrentSystem) {
	  const planetQuery = this.API_ENDPOINT + 'search/?' + queryString.stringify(CurrentSystem);
	  return fetch(planetQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
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

}

export default new ApiService();