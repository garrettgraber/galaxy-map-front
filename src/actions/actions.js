import omit from 'object.omit';
import Geohash from 'latlon-geohash';

import {
	setActiveSystem,
	setActiveSystemError,
	searchSystemsStart,
	searchSystemsFinish,
  setMapCenterAndZoom,
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
  addItemToDataStream,
  mostRecentDataStreamItem,
  setCurrentDataStreamItemToBlank,
  setNullHyperspaceHash,
  setSelectedHyperspaceHash,
  activeStartPosition,
  activeEndPosition,
  activeStartNode,
  activeEndNode,
  pathEndClickOff,
  pathStartClickOff,
  pinPointStartOff,
  pinPointEndOff,
  defaultCursor,
  loadingIconOff,
  loadingIconOn
} from './actionCreators.js';
import {
  getGalacticYFromLatitude,
  getGalacticXFromLongitude
} from '../components/hyperspaceNavigation/hyperspaceMethods.js';
import ApiService from '../remoteServices/apiService.js';

export function setCursorValue() {
  return function(dispatch, getState) {
    const currentCursor = getState().cursorValue;
    $('.leaflet-container').css('cursor', currentCursor);
    return null; 
  }
}

export function findSystem(systemName) {
	return function(dispatch, getState) {
    dispatch( searchSystemsStart() );
    ApiService.findSystemByName(systemName).then(json => {
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

    // dispatch(loadingIconOff());

    dispatch(calculateHyperspaceJumpOff());
    dispatch(hyperspaceNavigationUpdateOn());
    return null;
  }
}

export function getHyperspacePathCollection(HyperspacePathSearch, HyperspacePathData) {
	return function(dispatch, getState) {
    dispatch(calculateHyperspaceJumpOn());
    dispatch(loadingIconOn());
    ApiService.getHyperspacePathData(HyperspacePathSearch).then(response => {
      return response.json();
    }).then(data => {
      const dataStreamMessage = "Jump calculated from " + HyperspacePathSearch.startPoint + " to " + HyperspacePathSearch.endPoint;
      dispatch(addItemToDataStream(dataStreamMessage));
      dispatch(loadHyperspacePathCollections(data));
      dispatch(activeStartPosition(HyperspacePathData.StartPoint));
      dispatch(activeEndPosition(HyperspacePathData.EndPoint));
      dispatch(activeStartNode(HyperspacePathData.StartNode));
      dispatch(activeEndNode(HyperspacePathData.EndNode));
      dispatch(updateHyperspacePaths());
      dispatch(calculateHyperspaceJumpOff());
      dispatch(hyperspaceNavigationUpdateOn());
      dispatch(loadingIconOff());
      console.log("Hyperspace Jump Successful: ", getState());
    }).catch(err => {
      const dataStreamMessage = "Error calculating from " + HyperspacePathSearch.startPoint + " to " + HyperspacePathSearch.endPoint;
      console.log("err: ", err);
      dispatch(addItemToDataStream(dataStreamMessage));
      dispatch(errorHyperspacePath(err));

      // dispatch(loadingIconOff());
      
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
    console.log("hyperspacePositionSearch has fired...");
    const SystemSearchSent = omit(SystemSearch, ['isStartPosition']);
    ApiService.findPlanet(SystemSearchSent).then(response => {
      return response.json();
    }).then(data => {
      const PlanetData = JSON.parse(data);
      const NodeSearch = {system: PlanetData.system};
      ApiService.findHyperspaceNode(NodeSearch).then(responseNode => {
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
          const state = getState();
          if(state.pathStartClick) {
            dispatch(pathStartClickOff());
            dispatch(defaultCursor());
          }
          if(state.pathEndClick) {
            dispatch(pathEndClickOff());
            dispatch(defaultCursor());          
          }

        } else {
          const PlanetLocation = {
            lat: PlanetData.lat,
            lng: PlanetData.lng
          };
          ApiService.findNearestNode(PlanetLocation).then(response => {
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
              const state = getState();
              if(state.pathStartClick) {
                dispatch(pathStartClickOff());
                dispatch(defaultCursor());
              }
              if(state.pathEndClick) {
                dispatch(pathEndClickOff());
                dispatch(defaultCursor());          
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
    console.log("find and set nearest hyperspace node");
    ApiService.findNearestNode(LngLatSearch.LatLng).then(response => {
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
      const state = getState();
      if(state.pathSearchStart) {
        dispatch(pinPointStartOff());
      }
      if(state.pathSearchEnd) {
        dispatch(pinPointEndOff());
      }
      dispatch(defaultCursor());
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