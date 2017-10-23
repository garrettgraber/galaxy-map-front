import 'whatwg-fetch';
import urlencode from 'urlencode';
import queryString from 'query-string';
import omit from 'object.omit';
import hash from 'string-hash';
import Geohash from 'latlon-geohash';
import { batchActions } from 'redux-batched-actions';
import { chain } from 'redux-chain';



import {
	setActiveSystem,
	setActiveSystemError,
	searchSystemsStart,
	searchSystemsFinish,
  setMapCenterAndZoom,
  setMapZoom,
  setMapCenter,
  zoomPointOn,
  zoomPointOff,
  viewHasChangedAndRender,
	addHyperspacePathToCollection,
  loadHyperspacePathCollections,
  emptyHyperspacePathCollections,
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
  setStartData,
  addItemToDataStream,
  mostRecentDataStreamItem,
  setCurrentDataStreamItemToBlank,
  deCodeAdditionalCurrentItemLetter,
  zeroDecodedCurrentItemLetters,
  setNullHyperspaceHash,
  setSelectedHyperspaceHash,
  activeStartPosition,
  activeEndPosition,
  activeStartNode,
  activeEndNode
} from './actionCreators.js';

import {
  getGalacticYFromLatitude,
  getGalacticXFromLongitude
} from '../components/hyperspaceNavigation/hyperspaceMethods.js';


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

    dispatch( searchSystemsStart() );

    // now that the Store has been notified of the new todo item, we 
    // should also notify our server - we'll use here ES6 fetch 
    // function to post the data
    fetch('api/search/?system=' + urlencode(systemName)).then(response => {

    	return response.json();

    }).then(json => {

      // you should probably get a real id for your new todo item here, 
      // and update your store, but we'll leave that to you

    	let SystemObject = JSON.parse(json);
    	SystemObject = SystemObject[0];


    	if(SystemObject.hasLocation) {

        const dataStreamMessage = "Zoomed to " + SystemObject.system + ' ...';
        dispatch( addItemToDataStream(dataStreamMessage) );
        


				const LngLat = SystemObject.LngLat;
        const CurrentState = getState();
        const activeSystemZoom = CurrentState.activeSystem.zoom;
        let newZoom = 6;

        if(activeSystemZoom > 2) {
          newZoom = activeSystemZoom;
        }

				const SystemData = {
					lat: LngLat[1],
					lng: LngLat[0],
					system: SystemObject.system,
          zoom: newZoom
				};

        const stateBeforeDispatches = getState();

				dispatch(setActiveSystem(SystemData));
        const systemCenter = [SystemData.lat, SystemData.lng];
        dispatch(setMapCenterAndZoom(systemCenter, newZoom));
        dispatch(searchSystemsFinish());

        const stateAfterDispatches = getState();

    	}
    }).catch(err => {
    // Error: handle it the way you like, undoing the optimistic update,
    //  showing a "out of sync" message, etc.
      console.log("err in findPlanet: ", err);

      const dataStreamMessage = "Error searching for " + systemName + '.';
      dispatch( addItemToDataStream(dataStreamMessage) );
    	dispatch(setActiveSystemError(err));
    	dispatch(searchSystemsFinish());
    });
  // what you return here gets returned by the dispatch function that 
  // used this action creator
		return null; 
	}
}

export function zoomToLocation(locationCenter, zoom) {
  return function(dispatch, getState) {
    dispatch(setMapCenterAndZoom(locationCenter, zoom));
    return null;
  }
}

export function plotFreeSpaceJumpToNode(HyperspacePathData) {
  return function(dispatch, getState) {

    const dataStreamMessage = "Jump calculated from " + HyperspacePathData.StartPoint.system + " to " + HyperspacePathData.EndPoint.system;

    dispatch(addItemToDataStream(dataStreamMessage));
    dispatch(emptyHyperspacePathCollections());

    dispatch(activeStartPosition(HyperspacePathData.StartPoint));
    dispatch(activeEndPosition(HyperspacePathData.EndPoint));
    
    dispatch(activeStartNode(HyperspacePathData.StartNode));
    dispatch(activeEndNode(HyperspacePathData.EndNode));

    dispatch(updateHyperspacePaths());
    dispatch(calculateHyperspaceJumpOff());
    dispatch(hyperspaceNavigationUpdateOn());

    return null;
  }
}

export function getHyperspacePathCollection(HyperspacePathSearch, HyperspacePathData) {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter
	return function(dispatch, getState) {
    getHyperspacePathData(HyperspacePathSearch).then(response => {
    // getPathDataMany('Hovan', 'Tyluun', 40, 20).then(response => {
      return response.json();
    }).then(data => {
      const dataStreamMessage = "Jump calculated from " + HyperspacePathSearch.startPoint + " to " + HyperspacePathSearch.endPoint;
      
      console.log("Zima! HyperspacePathData: ", HyperspacePathData);

      dispatch(addItemToDataStream(dataStreamMessage));
      // dispatch(addHyperspacePathToCollection(data));
      dispatch(loadHyperspacePathCollections(data));
      dispatch(activeStartPosition(HyperspacePathData.StartPoint));
      dispatch(activeEndPosition(HyperspacePathData.EndPoint));

      
      dispatch(activeStartNode(HyperspacePathData.StartNode));
      dispatch(activeEndNode(HyperspacePathData.EndNode));


      dispatch(updateHyperspacePaths());
      dispatch(calculateHyperspaceJumpOff());
      dispatch(hyperspaceNavigationUpdateOn());

    }).catch(err => {
    // Error: handle it the way you like, undoing the optimistic update,
    //  showing a "out of sync" message, etc.

      const dataStreamMessage = "Error calculating from " + HyperspacePathSearch.startPoint + " to " + HyperspacePathSearch.endPoint;

      console.log("err: ", err);
      dispatch(addItemToDataStream(dataStreamMessage));

      dispatch(errorHyperspacePath(err));
      dispatch(calculateHyperspaceJumpOff());

    });
    return null;
	}
}

export function setSelectedHyperspaceRoute(hyperspaceHash) {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter
  return function(dispatch, getState) {
    dispatch(setSelectedHyperspaceHash(hyperspaceHash));
    dispatch(updateHyperspacePaths());
    dispatch(hyperspaceNavigationUpdateOn());
    return null;
  }
}

export function noSetSelectedHyperspaceRoute() {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter
  return function(dispatch, getState) {
    dispatch(setNullHyperspaceHash());
    dispatch(updateHyperspacePaths());
    dispatch(hyperspaceNavigationUpdateOn());
    return null;
  }
}

export function hyperspacePositionSearch(SystemSearch) {
  // we return a thunk function, not an action object!
  // the thunk function needs to dispatch some actions to change 
  // the Store status, so it receives the "dispatch" function as its
  // >first parameter
  return function(dispatch, getState) {
    const SystemSearchSent = omit(SystemSearch, ['isStartPosition']);
    findPlanet(SystemSearchSent).then(response => {
    // getPathDataMany('Hovan', 'Tyluun', 40, 20).then(response => {
      return response.json();
    }).then(data => {
      const PlanetDataArray = JSON.parse(data);
      if(PlanetDataArray.length > 0) {
        const PlanetDataArray = JSON.parse(data);
        const PlanetData = PlanetDataArray[0];
        const NodeSearch = {system: PlanetData.system};
        findHyperspaceNode(NodeSearch).then(responseNode => {
          return responseNode.json();
        }).then(dataNode => {
          const NodeDataArray = JSON.parse(dataNode);
          if(NodeDataArray.length > 0) {
            const NodeData = NodeDataArray[0];
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

            console.log("Pepsi NewPositionState: ", NewPositionState);
            console.log("Pepsi NewNodeState: ", NewNodeState);
            console.log("Pepsi NodeData: ", NodeData);

            if(SystemSearch.isStartPosition) {
              
              dispatch(setStartPosition(NewPositionState));
              dispatch(setStartNode(NewNodeState));
              dispatch(setStartSystem(SystemSearch.system));
              dispatch(hyperspaceNavigationUpdateOn());

            } else {

              dispatch(setEndPosition(NewPositionState));
              dispatch(setEndNode(NewNodeState));
              dispatch(setEndSystem(SystemSearch.system));
              dispatch(hyperspaceNavigationUpdateOn());

            }
          } else {
            
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
                const NewPositionStateFound = createPositionFromPlanet(PlanetData);
                const NewNodeStateNearest = createNodeState(NodeDataNearest);

                console.log("Pepsi NodeDataNearest: ", NodeDataNearest);
                console.log("Pepsi New Node State Nearest: ", NewNodeStateNearest);

                if(SystemSearch.isStartPosition) {

                  dispatch(setStartNode(NewNodeStateNearest));
                  dispatch(setStartPosition(NewPositionStateFound));
                  dispatch(setStartSystem(SystemSearch.system));
                  dispatch(hyperspaceNavigationUpdateOn());

                } else {

                  dispatch(setEndNode(NewNodeStateNearest));
                  dispatch(setEndPosition(NewPositionStateFound));
                  dispatch(setEndSystem(SystemSearch.system));
                  dispatch(hyperspaceNavigationUpdateOn());
                }

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
    findNearestNode(LngLatSearch.LatLng).then(response => {
      return response.json();
    }).then(data => {

      const NodeDataArray = JSON.parse(data);
      const NodeState = NodeDataArray[0]
      const NewNodeState = omit(NodeState, ['_id', '__v']);
      const lat = LngLatSearch.LatLng.lat;
      const lng = LngLatSearch.LatLng.lng;
      const NameHash = "ES@" + Geohash.encode(lat, lng, 22);
      const xGalacticLong = getGalacticXFromLongitude(lng);
      const yGalacticLong = getGalacticYFromLatitude(lat);
      const NewPositionState = {
        system: NameHash,
        lat: lat,
        lng: lng,
        xGalacticLong: xGalacticLong,
        yGalacticLong: yGalacticLong
      };


      console.log("Pepsi New Node State: ", NewNodeState);
      console.log("Pepsi New Position State: ", NewPositionState);

      if(LngLatSearch.isStartNode) {
        dispatch(setStartPosition(NewPositionState));
        dispatch(setStartNode(NewNodeState));
        dispatch(setStartSystem(NewPositionState.system));
        dispatch(hyperspaceNavigationUpdateOn());
      } else {
        dispatch(setEndPosition(NewPositionState));
        dispatch(setEndNode(NewNodeState));
        dispatch(setEndSystem(NewPositionState.system));
        dispatch(hyperspaceNavigationUpdateOn());
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


function setDataStreamItemThenClear(dataStreamItem) {
  return function(dispatch, getState) {
    dispatch( addItemToDataStream(dataStreamItem) );
    setTimeout(function() {
      dispatch( setCurrentDataStreamItemToBlank(dataStreamItem) );
    }, 20*1000);
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
    lng: PlanetData.lng,
    xGalacticLong: PlanetData.xGalacticLong,
    yGalacticLong: PlanetData.yGalacticLong
  }
}

function createNodeState(NodeData) { return omit(NodeData, ['_id', '__v', 'loc']) }

function findPlanet(systemSearch) {
  const planetQuery = 'api/search/?' + queryString.stringify(systemSearch);
  return fetch(planetQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

function findHyperspaceNode(nodeSearch) {
  const nodeQuery = '/api/hyperspacenode/search?' + queryString.stringify(nodeSearch);
  return fetch(nodeQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

function findNearestNode(LngLatSearch) {
  const nodeQuery = '/api/hyperspacenode/closet?' + queryString.stringify(LngLatSearch);
  return fetch(nodeQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

// Un-used
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

// Un-used
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
