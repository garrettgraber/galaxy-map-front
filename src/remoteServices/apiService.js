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
}

export default new ApiService();