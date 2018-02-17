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
	addHyperspacePathToCollection,
  loadHyperspacePathCollections,
  emptyHyperspacePathCollections,
  updateHyperspacePaths,
	errorHyperspacePath,
  setStartPosition,
  setEndPosition,
  setStartPositionError,
  setEndPositionError,
  setDefaultStartPosition,
  setDefaultEndPosition,
  setStartNode,
  setEndNode,
  setStartSystem,
  setEndSystem,
  calculateHyperspaceJumpOn,
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
  activeEndNode,
  pathEndClickOff,
  pathStartClickOff,
  pathStartClickOn,
  pathEndClickOn,
  pinPointStartOn,
  pinPointStartOff,
  pinPointEndOn,
  pinPointEndOff,
  hyperspaceJumpStarting,
  hyperspaceJumpCompleted
} from './actionCreators.js';
import {
  getGalacticYFromLatitude,
  getGalacticXFromLongitude
} from '../components/hyperspaceNavigation/hyperspaceMethods.js';
import * as ActionCreators from '../constants/actionTypes.js';

export function findSystem(systemName) {
	return function(dispatch, getState) {
    dispatch( searchSystemsStart() );
    fetch('api/search/?system=' + urlencode(systemName)).then(response => {
    	return response.json();
    }).then(json => {
    	let SystemObject = JSON.parse(json);
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
      console.log("err in findPlanet: ", err);
      const dataStreamMessage = "Error searching for " + systemName + '.';
      dispatch( addItemToDataStream(dataStreamMessage) );
    	dispatch(setActiveSystemError(err));
    	dispatch(searchSystemsFinish());
    });
		return null; 
	}
}

export function setPositionToDefault(isStartPosition) {
  return function (dispatch, getState) {
    if(isStartPosition) {
      dispatch(setDefaultStartPosition());
    } else {
      dispatch(setDefaultEndPosition());
    }
    console.log("After setPositionToDefault: ", getState());

    dispatch(hyperspaceNavigationUpdateOn());

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

    dispatch(calculateHyperspaceJumpOn());
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
	return function(dispatch, getState) {

    dispatch(calculateHyperspaceJumpOn());

    getHyperspacePathData(HyperspacePathSearch).then(response => {
      return response.json();
    }).then(data => {
      const dataStreamMessage = "Jump calculated from " + HyperspacePathSearch.startPoint + " to " + HyperspacePathSearch.endPoint;

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

      console.log("Hyperspace Jump Successful: ", getState());

    }).catch(err => {

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
  return function(dispatch, getState) {
    dispatch(setSelectedHyperspaceHash(hyperspaceHash));
    dispatch(updateHyperspacePaths());
    dispatch(hyperspaceNavigationUpdateOn());
    return null;
  }
}

export function noSetSelectedHyperspaceRoute() {
  return function(dispatch, getState) {
    dispatch(setNullHyperspaceHash());
    dispatch(updateHyperspacePaths());
    dispatch(hyperspaceNavigationUpdateOn());
    return null;
  }
}

export function hyperspacePositionSearch(SystemSearch) {
  return function(dispatch, getState) {
    const SystemSearchSent = omit(SystemSearch, ['isStartPosition']);
    findPlanet(SystemSearchSent).then(response => {
      return response.json();
    }).then(data => {
      const PlanetData = JSON.parse(data);
      const NodeSearch = {system: PlanetData.system};
      findHyperspaceNode(NodeSearch).then(responseNode => {
        return responseNode.json();
      }).then(dataNode => {
        const NodeDataArray = JSON.parse(dataNode);
        if(NodeDataArray.length > 0) {
          const NodeData = NodeDataArray[0];
          const NewPositionState = createPositionFromNode(NodeData);
          const NewNodeState = createNodeState(NodeData);

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
    }).catch(err => {
      console.log("err: ", err);
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
  console.log("PathSearch: ", PathSearch);
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
