import omit from 'object.omit';
import Geohash from 'latlon-geohash';
import _ from 'lodash';

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
  loadingIconOn,
  starMapIsOn,
  sectorMapIsOn,
  newSystemsLocation,
  newSectorData,
  buildHyperspaceRouteNameSet,
  newHyperspaceRoute
} from './actionCreators.js';
import {
  getGalacticYFromLatitude,
  getGalacticXFromLongitude
} from '../components/hyperspaceNavigation/hyperspaceMethods.js';
import ApiService from '../remoteServices/apiService.js';



export function findHyperspaceRoute(routeName) {
  return function(dispatch, getState) {
    ApiService.searchForHyperspaceRoute({name: routeName}).then(data => {
      const dataParsed = JSON.parse(data);
      dispatch(addItemToDataStream('Found the ' + dataParsed.name));
      dispatch(newHyperspaceRoute(dataParsed));
    });
    return null;
  }  
}

export function buildHyperspaceLaneNamesSet() {
  return function(dispatch, getState) {
    ApiService.allHyperspaceLaneNames().then(data => {
      const dataParsed = JSON.parse(data);
      const laneNamesSet = new Set(dataParsed);
      dispatch(buildHyperspaceRouteNameSet(laneNamesSet));
    });
    return null; 
  }
}

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
        const dataStreamMessage = "Found " + SystemObject.system + ' ...';
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
          zoom: newZoom,
          xGalactic: SystemObject.xGalactic,
          yGalactic: SystemObject.yGalactic,
          xGalacticLong: SystemObject.xGalacticLong,
          yGalacticLong: SystemObject.yGalacticLong,
          emptySpace: false,
          coordinates: SystemObject.coordinates,
          sector: SystemObject.sector,
          region: SystemObject.region,
          link: SystemObject.link
				};
				dispatch(setActiveSystem(SystemData));
        dispatch(newSystemsLocation({
          lat: SystemData.lat,
          lng: SystemData.lng
        }));
        dispatch(searchSystemsFinish());
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

export function zoomToSector(SectorSearch, zoom) {
  return function(dispatch, getState) {
    ApiService.findSector({name: SectorSearch.label}).then(sectorFoundJson => {
      const sectorFoundResults = JSON.parse(sectorFoundJson);
      const SectorFound = sectorFoundResults[0];
      const dataStreamMessage = "Found the " + SectorFound.name + ' Sector...';
      dispatch( addItemToDataStream(dataStreamMessage) );
      dispatch(newSectorData(createSectorData(SectorFound)));
    }).catch(sectorFoundError => {
      console.log("error finding sector: ", sectorFoundError);
    });
    return null;
  }
}

function createSectorData(CurrentSector) {
  return omit(CurrentSector, [
    '_id',
    '__v',
  ]);
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
          const NewPositionState = createPositionFromPlanet(PlanetData);
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
    }).then(dataNode => {
      const nodeDataArray = JSON.parse(dataNode);
      const NodeData = nodeDataArray[0];
      const NewNodeState = createNodeState(NodeData);
      ApiService.findSystemByName(Options.system).then(dataSystem => {
        const DataSystemParsed = JSON.parse(dataSystem);
        const NewPositionState = createPositionFromPlanet(DataSystemParsed);
        dispatch(setHyperspaceState({
          isStartPosition: Options.isStartPosition,
          NewNodeState: NewNodeState,
          NewPositionState: NewPositionState,
          system: Options.system
        }));
      }).catch(SystemDataError => {
        console.log("Error getting system data: ", SystemDataError);
      });
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

async function getNodeDataForUtegetuNebula() {
  try {
    const response = await ApiService.nodeDataForUtegetuNebula();
    const NodeData = response.json();
    return NodeData;
  } catch(err) {
    console.log("Error getting node data for Utegetu Nebula");
  }
}

async function getNodeDataForTheRedoubt() {
  try {
    const response = await ApiService.nodeDataForTheRedoubt();
    const NodeData = response.json();
    return NodeData;
  } catch(err) {
    console.log("Error getting node data for The Redoubt");
  }
}












export function findAndSetNearsetHyperspaceNode(LngLatSearch) {
  return function(dispatch, getState) {
    ApiService.findNearestNode(LngLatSearch.LatLng).then(response => {
      return response.json();
    }).then(data => {
      const NodeDataArray = JSON.parse(data);
      const NodeState = NodeDataArray[0];
      const NewNodeState = omit(NodeState, ['_id', '__v']);
      const lat = LngLatSearch.LatLng.lat;
      const lng = LngLatSearch.LatLng.lng;
      let emptySpaceGeoHash = Geohash.encode(lat, lng, 22);
      const upperCaseGeoHashShort = emptySpaceGeoHash.toUpperCase().slice(0,7);
      const NameHash = 'Empty Space ' + upperCaseGeoHashShort;
      const xGalacticLong = getGalacticXFromLongitude(lng);
      const yGalacticLong = getGalacticYFromLatitude(lat);
      const xGalactic = xGalacticLong.toFixed(2);
      const yGalactic = yGalacticLong.toFixed(2);
      const NewPositionState = {
        system: NameHash,
        lat: lat,
        lng: lng,
        xGalacticLong: xGalacticLong,
        yGalacticLong: yGalacticLong,
        xGalactic: xGalactic,
        yGalactic: yGalactic,
        zoom: 10,
        emptySpace: true,
        link: '',
        sector: [null],
        region: '',
        coordinates: 'Unknown'
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
    'geoHash',
    'hyperspaceLanes',
    'loc',
    'nodeId'
  ]);
}

function createPositionFromPlanetEmptySpace(PlanetData) {
  return {
    system: PlanetData.system,
    lat: PlanetData.lat,
    lng: PlanetData.lng,
    xGalactic: PlanetData.xGalactic,
    yGalactic: PlanetData.yGalactic,
    xGalacticLong: PlanetData.xGalacticLong,
    yGalacticLong: PlanetData.yGalacticLong,
    zoom: PlanetData.zoom,
    emptySpace: true,
    coordinates: '',
    sector: [null],
    region: '',
    link: ''
  }
}

function createPositionFromPlanet(PlanetData) {
  return {
    system: PlanetData.system,
    lat: PlanetData.lat,
    lng: PlanetData.lng,
    xGalactic: PlanetData.xGalactic,
    yGalactic: PlanetData.yGalactic,
    xGalacticLong: PlanetData.xGalacticLong,
    yGalacticLong: PlanetData.yGalacticLong,
    zoom: PlanetData.zoom,
    emptySpace: false,
    coordinates: PlanetData.coordinates,
    sector: PlanetData.sector,
    region: PlanetData.region,
    link: PlanetData.link
  }
}

function createNodeState(NodeData) {
  return omit(NodeData, ['_id', '__v', 'loc', 'geoHash']);
}
