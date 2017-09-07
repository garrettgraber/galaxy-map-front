import 'whatwg-fetch';
import urlencode from 'urlencode';
import queryString from 'query-string';
import omit from 'object.omit';
import hash from 'string-hash';
import Geohash from 'latlon-geohash';
import { batchActions } from 'redux-batched-actions';



import {
	zoomToSystem,
	zoomToSystemError,
	searchSystemsStart,
	searchSystemsFinish,
	setZoomValue,
	addHyperspacePathToCollection,
  loadHyperspacePathCollections,
  updateHyperspacePaths,
	errorHyperspacePath,
  setStartPosition,
  setEndPosition,
  setStartPositionError,
  setEndPositionError,
  setStartNode,
  setEndNode,
  setStartSystem,
  setEndSystem,
  calculateHyperspaceJumpOff,
  hyperspaceNavigationUpdateOn,
  hyperspaceNavigationUpdateOff,
  setStartData
} from './actionCreators.js';


import * as ActionCreators from '../constants/actionTypes.js';
// the async action creator uses the name of the old action creator, so 
// it will get called by the existing code when a new todo item should 
//  be added
export function findSystem(systemName) {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter

	return function(dispatch, getState) {
    // here starts the code that actually gets executed when the 
    //  addTodo action creator is dispatched

    // first of all, let's do the optimistic UI update - we need to 
    // dispatch the old synchronous action object, using the renamed 
    // action creator
    dispatch(searchSystemsStart());

    // now that the Store has been notified of the new todo item, we 
    // should also notify our server - we'll use here ES6 fetch 
    // function to post the data
    fetch('api/search/?system=' + urlencode(systemName)).then(response => {

    	return response.json();

    }).then(json => {

    	// console.log("json: ", json);
      // you should probably get a real id for your new todo item here, 
      // and update your store, but we'll leave that to you
    	let SystemObject = JSON.parse(json);
    	SystemObject = SystemObject[0];

    	// console.log("SystemObject: ", SystemObject);

    	if(SystemObject.hasLocation) {

				const LngLat = SystemObject.LngLat;

				const SystemData = {
					lat: LngLat[1],
					lng: LngLat[0],
					system: SystemObject.system
				};

				console.log("SystemData: ", SystemData);

				dispatch(zoomToSystem(SystemData));
				dispatch(setZoomValue(6));

    	}
    }).catch(err => {
    // Error: handle it the way you like, undoing the optimistic update,
    //  showing a "out of sync" message, etc.
    	dispatch(zoomToSystemError(err));
    	dispatch(searchSystemsFinish());
    });
  // what you return here gets returned by the dispatch function that 
  // used this action creator
		return null; 
	}
}

export function getHyperspacePathCollection(HyperspacePathSearch) {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter
	return function(dispatch, getState) {
    getHyperspacePathData(HyperspacePathSearch).then(response => {
    // getPathDataMany('Hovan', 'Tyluun', 40, 20).then(response => {
      console.log("json response: ", response);
      return response.json();
    }).then(data => {
      console.log("hyperspace route: ", data.paths.length);
      // dispatch(addHyperspacePathToCollection(data));
      dispatch(loadHyperspacePathCollections(data));
      dispatch(updateHyperspacePaths());
      dispatch(calculateHyperspaceJumpOff());
      dispatch(hyperspaceNavigationUpdateOn());

    }).catch(err => {
    // Error: handle it the way you like, undoing the optimistic update,
    //  showing a "out of sync" message, etc.
      console.log("err: ", err);
      dispatch(errorHyperspacePath(err));
    });
    return null;
	}
}

export function hyperspacePositionSearch(SystemSearch) {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter
  return function(dispatch, getState) {
    console.log("SystemSearch: ", SystemSearch);
    const SystemSearchSent = omit(SystemSearch, ['isStartPosition']);
    findPlanet(SystemSearchSent).then(response => {
    // getPathDataMany('Hovan', 'Tyluun', 40, 20).then(response => {
      return response.json();
    }).then(data => {
      const PlanetDataArray = JSON.parse(data);
      if(PlanetDataArray.length > 0) {
        const PlanetDataArray = JSON.parse(data);
        const PlanetData = PlanetDataArray[0];
        console.log("PlanetData: ", PlanetData);
        const NodeSearch = {system: PlanetData.system};
        findHyperspaceNode(NodeSearch).then(responseNode => {
          console.log("responseNode: ", responseNode);
          return responseNode.json();
        }).then(dataNode => {
          const NodeDataArray = JSON.parse(dataNode);
          console.log("NodeDataArray: ", NodeDataArray);
          if(NodeDataArray.length > 0) {
            const NodeData = NodeDataArray[0];
            console.log("node data: ", NodeData);
            // const NewNodeState = omit(NodeData, ['_id', '__v']);
            // const NewPositionState = omit(NodeData, [
            //   '_id',
            //   '__v',
            //   'hyperspaceLanes',
            //   'loc',
            //   'nodeId'
            // ]);
            const NewPositionState = createPositionFromNode(NodeData);
            const NewNodeState = createNodeState(NodeData);
            if(SystemSearch.isStartPosition) {
              
              dispatch(setStartPosition(NewPositionState));
              dispatch(setStartNode(NewNodeState));
              dispatch(setStartSystem(SystemSearch.system));
              dispatch(hyperspaceNavigationUpdateOn());
              console.log("\n\nStart Position Updated!!!\n\n");

            } else {
              dispatch(setEndPosition(NewPositionState));
              dispatch(setEndNode(NewNodeState));
              dispatch(setEndSystem(SystemSearch.system));
              dispatch(hyperspaceNavigationUpdateOn());
              console.log("\n\nEnd Position Updated!!!\n\n");

            }
          } else {
            console.log("Not a hyperspace node: ", NodeSearch.system);
            console.log("PlanetData: ", PlanetData);
            const PlanetLocation = {
              lat: PlanetData.lat,
              lng: PlanetData.lng
            };
            findNearestNode(PlanetLocation).then(response => {
              return response.json();
            }).then(data => {
              const NodeDataArrayNearest = JSON.parse(data);

              if(NodeDataArrayNearest.length > 0) {
                const NodeDataNearest = NodeDataArrayNearest[0];
                console.log("NodeDataNearest: ", NodeDataNearest);
                const NewPositionStateFound = createPositionFromPlanet(PlanetData);
                const NewNodeStateNearest = createNodeState(NodeDataNearest);

                if(SystemSearch.isStartPosition) {
                  dispatch(setStartNode(NewNodeStateNearest));
                  dispatch(setStartPosition(NewPositionStateFound));
                  dispatch(setStartSystem(SystemSearch.system));
                  dispatch(hyperspaceNavigationUpdateOn());
                  console.log("\n\nStart Position Updated!!!\n\n");

                } else {
                  dispatch(setEndNode(NewNodeStateNearest));
                  dispatch(setEndPosition(NewPositionStateFound));
                  dispatch(setEndSystem(SystemSearch.system));
                  dispatch(hyperspaceNavigationUpdateOn());
                  console.log("\n\nEnd Position Updated!!!\n\n");
                }

                console.log("dispatches have been set");
              }        
            }).catch(errNearestNode => {
              console.log("node nearest data error: ", errNearestNode);
            });
          }
        }).catch(errNode => {
          console.log("node data error: ", errNode);
        });
      }
    }).catch(err => {
    // Error: handle it the way you like, undoing the optimistic update,
    //  showing a "out of sync" message, etc.
      console.log("err: ", err);
      // dispatch(errorHyperspacePath(err));
      if(SystemSearch.isStartPosition) {
        dispatch(setStartPositionError(err));
      } else {
        dispatch(setEndPositionError(err));
      }
    });
    return null;
  }
}

export function findAndSetNearsetHyperspaceNode(LngLatSearch) {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter
  return function(dispatch, getState) {
    console.log("LngLatSearch.LatLng: ", LngLatSearch.LatLng);
    findNearestNode(LngLatSearch.LatLng).then(response => {
      console.log("response data is present");
      return response.json();
    }).then(data => {


      const NodeDataArray = JSON.parse(data);
      const NodeState = NodeDataArray[0]
      const NewNodeState = omit(NodeState, ['_id', '__v']);
      const lat = LngLatSearch.LatLng.lat;
      const lng = LngLatSearch.LatLng.lng;
      const NameHash = "ES@" + Geohash.encode(lat, lng, 22);
      const NewPositionState = {
        system: NameHash,
        lat: lat,
        lng: lng
      };


      if(LngLatSearch.isStartNode) {
        dispatch(setStartPosition(NewPositionState));
        dispatch(setStartNode(NewNodeState));
        dispatch(setStartSystem(NewPositionState.system));
        dispatch(hyperspaceNavigationUpdateOn());
        console.log("\n\nStart Position Updated!!!\n\n");
      } else {
        dispatch(setEndPosition(NewPositionState));
        dispatch(setEndNode(NewNodeState));
        dispatch(setEndSystem(NewPositionState.system));
        dispatch(hyperspaceNavigationUpdateOn());
        console.log("\n\nEnd Position Updated!!!\n\n");
      }
    }).catch(err => {
    // Error: handle it the way you like, undoing the optimistic update,
    //  showing a "out of sync" message, etc.
      console.log("err: ", err);
      if(LngLatSearch.isStartNode) {
        dispatch(setStartPositionError(err));
      } else {
        dispatch(setEndPositionError(err));
      }
    });
    return null;
  }
}


function createPositionFromNode(NodeData) {
  return omit(NodeData, [
    '_id',
    '__v',
    'hyperspaceLanes',
    'loc',
    'nodeId'
  ]);
}

function createPositionFromPlanet(PlanetData) {
  return {
    system: PlanetData.system,
    lat: PlanetData.lat,
    lng: PlanetData.lng
  }
}

function createNodeState(NodeData) {
  return omit(NodeData, ['_id', '__v']);
}

function findPlanet(systemSearch) {
  const planetQuery = 'api/search/?' + queryString.stringify(systemSearch);
  console.log("url for planet query: ", planetQuery);
  return fetch(planetQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

function findHyperspaceNode(nodeSearch) {
  const nodeQuery = '/api/hyperspacenode/search?' + queryString.stringify(nodeSearch);
  console.log("url for node query: ", nodeQuery);
  return fetch(nodeQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

function findNearestNode(LngLatSearch) {
  const nodeQuery = '/api/hyperspacenode/closet?' + queryString.stringify(LngLatSearch);
  console.log("url for nearest: ", nodeQuery);
  return fetch(nodeQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

function getPathDataShortest(start, end, maxJumps) {
  return fetch('/api/hyperspace-jump/calc-shortest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start: start,
      end: end,
      maxJumps: maxJumps
    })
  });
}

function getPathDataMany(start, end, maxJumps, limit) {
  return fetch('/api/hyperspace-jump/calc-many', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start: start,
      end: end,
      maxJumps: maxJumps,
      limit: limit
    })
  });
}


function getHyperspacePathData(PathSearch) {
	let jumpEndpoint = '/api/hyperspace-jump/';
	jumpEndpoint += (PathSearch.shortest)? 'calc-shortest' : 'calc-many';
  return fetch(jumpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(PathSearch)
  });
}


function createId() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
