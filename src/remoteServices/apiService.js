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

		// return systemLinkAsync(CurrentSystem, this.API_ENDPOINT);

	  const planetQuery = this.API_ENDPOINT + 'search/?' + queryString.stringify(CurrentSystem);
	  return fetch(planetQuery, {
	    method: 'GET',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	  });

	}
}

export default new ApiService();



// async function systemLinkAsync(CurrentSystem, apiEndPoint) {
// 	try {

// 	  const planetQuery = apiEndPoint + 'search/?' + queryString.stringify(CurrentSystem);
// 	  const response = await fetch(planetQuery, {
// 	    method: 'GET',
// 	    headers: {
// 	      'Content-Type': 'application/json'
// 	    },
// 	  });
// 	  const data = response.json();
// 	  console.log("data: ", data);
// 	  const DataParsed = JSON.parse(data);
//   	console.log("Data: ", DataParsed.link);
//   	return DataParsed.link;



// 	  // .then(response => {
// 	  // 	return response.json();
// 	  // }).then(data => {
// 	  // 	// console.log("data: ", isJson(data));

// 	  // 	const DataParsed = JSON.parse(data);
// 	  // 	console.log("Data: ", DataParsed.link);
// 	  // });



// 	} catch(err) {
// 		console.log("Error getting system link: ", err);
// 	}
// }



function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}