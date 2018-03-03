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
          dispatch(checkNodesAndUpdate({
            isStartPosition: SystemSearch.isStartPosition,
            NewNodeState: NewNodeState,
            NewPositionState: NewPositionState,
            system: SystemSearch.system
          }));
        } else {
          const PlanetLocation = {
            lat: PlanetData.lat,
            lng: PlanetData.lng
          };
          ApiService.findNearestNode(PlanetLocation).then(response => {
            return response.json();
          }).then(data => {
            const NodeDataArray = JSON.parse(data);
            if(NodeDataArray.length > 0) {
              const NodeData = NodeDataArray[0];
              const NewPositionState = createPositionFromPlanet(PlanetData);
              const NewNodeState = createNodeState(NodeData);
              dispatch(checkNodesAndUpdate({
                isStartPosition: SystemSearch.isStartPosition,
                NewNodeState: NewNodeState,
                NewPositionState: NewPositionState,
                system: SystemSearch.system
              }));
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

function setHyperspaceState(Options) {
  return function (dispatch, getState) {
    dispatch(setNavigationPoints(Options));
    dispatch(hyperspaceNavigationUpdateOn());
    dispatch(setPathClickState());
    return null;
  }
}

function setNavigationPoints(Options) {
  return function (dispatch, getState) {
    if(Options.isStartPosition) {
      dispatch(setStartNode(Options.NewNodeState));
      dispatch(setStartPosition(Options.NewPositionState));
      dispatch(setStartSystem(Options.system));
    } else {
      dispatch(setEndNode(Options.NewNodeState));
      dispatch(setEndPosition(Options.NewPositionState));
      dispatch(setEndSystem(Options.system));
    }
    return null;
  };
}

function setPathClickState() {
  return function (dispatch, getState) {
    const state = getState();
    if(state.pathStartClick) {
      dispatch(pathStartClickOff());
      dispatch(defaultCursor());
    }
    if(state.pathEndClick) {
      dispatch(pathEndClickOff());
      dispatch(defaultCursor());          
    }
    return null;
  };
}

function checkNodesAndUpdate(Options) {
  return function (dispatch, getState) {
    const unknownRegionsEdgeNode = 'The Redoubt';
    const widerGalaxyEdgeNode = 'Utegetu Nebula';
    const CurrentState = getState();
    const currentStartNode = CurrentState.hyperspaceStartNode.system;
    const currentEndNode = CurrentState.hyperspaceEndNode.system;
    const checkConnectionToStartNode = (currentStartNode && !Options.isStartPosition)? true : false;
    const checkConnectionToEndNode = (currentEndNode && Options.isStartPosition)? true : false;
    if(checkConnectionToStartNode || checkConnectionToEndNode) {
      getNodeConnectionData({
        startNodeSystem: currentStartNode,
        endNodeSystem: currentEndNode,
        system: Options.system,
        isStartPosition: Options.isStartPosition
      }).then(data => {
        if(data.connected) {
          dispatch(setHyperspaceState(Options));
        } else {
          const connectedToCoruscantButNotCsilla = data.connectionToCoruscant && !data.connectionToCsilla;
          const searchIsStartName = (connectedToCoruscantButNotCsilla)? widerGalaxyEdgeNode : unknownRegionsEdgeNode;
          const searchIsEndName = (connectedToCoruscantButNotCsilla)? unknownRegionsEdgeNode : widerGalaxyEdgeNode;
          const newEndNodeName = (Options.isStartPosition)? searchIsStartName : searchIsEndName;
          dispatch(setEndNodeAndPoint({
            isStartPosition: false,
            system: newEndNodeName
          }));
          dispatch(addItemToDataStream('Jumping to ' + newEndNodeName + ' instead'));
          if(Options.isStartPosition) {
            dispatch(setHyperspaceState(Options));
          } else {
            dispatch(hyperspaceNavigationUpdateOn());
            dispatch(setPathClickState());
          }
        }
      }).catch(error => {
        console.log("systems connected error: ", error);
      });
    } else {
      dispatch(setHyperspaceState(Options));
    }
    return null;
  };
}

function setEndNodeAndPoint(Options) {
  return function (dispatch, getState) {
    ApiService.findHyperspaceNode({system: Options.system}).then(nodeResponse => {
      return nodeResponse.json();
    }).then(NodeDataJson => {
      const NodeData = JSON.parse(NodeDataJson);
      const NewPositionStateData = createPositionFromNode(NodeData);
      const NewNodeStateData = createNodeState(NodeData);
      const NewPositionState = NewPositionStateData[0];
      const NewNodeState = NewNodeStateData[0];
      dispatch(setHyperspaceState({
        isStartPosition: Options.isStartPosition,
        NewNodeState: NewNodeState,
        NewPositionState: NewPositionState,
        system: Options.system
      }));
    }).catch(NodeDataError => {
      console.log("Error finding hyperspace node: ", NodeDataError);
    });
    return null;
  };
}

async function getNodeConnectionData(Options) {
  try {
    const responseCoruscant = await nodeIsConnectedToCoruscant({system: Options.system});
    const CoruscantConnection = JSON.parse(responseCoruscant);
    const responseCsilla = await nodeIsConnectedToCsilla({system: Options.system});
    const CsillaConnection = JSON.parse(responseCsilla);
    const NodeConnectionStatus = await checkIfNodesAreConnected(Options);
    const NodeConnectionData = JSON.parse(NodeConnectionStatus);
    return {
      connected: NodeConnectionData.connected,
      connectionToCoruscant: CoruscantConnection,
      connectionToCsilla: CsillaConnection
    };
  } catch(err) {
    console.log("Error checking if nodes are connected: ", err);
  }
}

async function checkIfNodesAreConnected(Options) {
  try {
    const oppositeNodeOfSearch = (Options.isStartPosition)? Options.endNodeSystem : Options.startNodeSystem;
    const SearchData = {
      systems: [oppositeNodeOfSearch, Options.system]
    };
    const response = await ApiService.systemsConnected(SearchData);
    const systemsConnected = response.json();
    return systemsConnected;
  } catch(err) {
    console.log("Error checking if nodes are connected: ", err);
  }
}

async function nodeIsConnectedToCoruscant(Options) {
  try {
    const response = await ApiService.systemConnectedToCoruscant({system: Options.system});
    const systemConnectedStatus = response.json();
    return systemConnectedStatus;
  } catch(err) {
    console.log("Error checking if nodes are connected: ", err);
  }
}

async function nodeIsConnectedToCsilla(Options) {
  try {
    const response = await ApiService.systemConnectedToCsilla({system: Options.system});
    const systemConnectedStatus = response.json();
    return systemConnectedStatus;
  } catch(err) {
    console.log("Error checking if nodes are connected: ", err);
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


function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}