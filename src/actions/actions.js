import omit from 'object.omit';

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
  setStartNode,
  setEndNode,
  setStartSystem,
  setEndSystem,
  calculateHyperspaceJumpOn,
  calculateHyperspaceJumpOff,
  hyperspaceNavigationUpdateOn,
  addItemToDataStream,
  setNullHyperspaceHash,
  setSelectedHyperspaceHash,
  activeStartPosition,
  activeEndPosition,
  activeStartNode,
  activeEndNode,
  pathEndClickOff,
  pathStartClickOff,
  defaultCursor,
  loadingIconOff,
  loadingIconOn,
  newSystemsLocation,
  newSectorData,
  buildHyperspaceRouteNameSet,
  newHyperspaceRoute,
  baseMapIsGalaxy,
  baseMapIsBlack,
  baseMapIsWhite
} from './actionCreators.js';

import ApiService from '../remoteServices/apiService.js';
import Place from '../classes/place.js';



function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


export function changeBaseLayer(newBaseLayer) {
  return function(dispatch, getState) {
    switch (newBaseLayer) {
      case "Galaxy":
        dispatch(baseMapIsGalaxy());
        break;
      case "Black":
        dispatch(baseMapIsBlack());
        break;
      case "White":
        dispatch(baseMapIsWhite());
        break;
      default:
        dispatch(baseMapIsBlack());
    }
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
    ApiService.findSystemByName(systemName).then(SystemObject => {
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



export function zoomToLocation(locationCenter, zoom) {
  return function(dispatch, getState) {
    dispatch(setMapCenterAndZoom(locationCenter, zoom));
    return null;
  }
}

// Sector Actions
export function zoomToSector(SectorSearch, zoom) {
  return function(dispatch, getState) {
    ApiService.findSector({name: SectorSearch.label}).then(sectorFoundResults => {
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



// Hyperspace Lane and Route Actions
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
    ApiService.getHyperspacePathData(HyperspacePathSearch).then(data => {
      const dataStreamMessage = "Jump calculated from " + HyperspacePathSearch.startPoint + " to " + HyperspacePathSearch.endPoint;
      dispatch(addItemToDataStream(dataStreamMessage));
      dispatch(loadHyperspacePathCollections(data));


      dispatch(loadShipHyperspaceData(data));


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


export function jumpShipToDestination(HyperspacePathSearch, HyperspacePathData) {
  return function(dispatch, getState) {
    ApiService.getHyperspacePathData(HyperspacePathSearch).then(data => {
      console.log("Path Data: ", data);
    }).catch(err => {
      console.log("err: ", err);
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

export function findHyperspaceRoute(routeName) {
  return function(dispatch, getState) {
    ApiService.searchForHyperspaceRoute({name: routeName}).then(RouteData => {
      dispatch(addItemToDataStream('Found the ' + RouteData.name));
      dispatch(newHyperspaceRoute(RouteData));
    });
    return null;
  }  
}

export function buildHyperspaceLaneNamesSet() {
  return function(dispatch, getState) {
    ApiService.allHyperspaceLaneNames().then(LaneData => {
      const laneNamesSet = new Set(LaneData);
      dispatch(buildHyperspaceRouteNameSet(laneNamesSet));
    });
    return null; 
  }
}







// Navigation Point Actions
export function setHyperspaceNavigationPoints(PlaceObject) {
  return function(dispatch, getState) {
    createNodeAndPositionObjects(PlaceObject).then(NodesAndPositions => {
      dispatch(checkNodeConnectionAndUpdate({
        isStartPosition: PlaceObject.isStartPosition,
        NewNodeState: NodesAndPositions.NewNodeState,
        NewPositionState: NodesAndPositions.NewPositionState,
        system: NodesAndPositions.NewPositionState.system
      }));
    });
    return null;
  }
}

function checkNodeConnectionAndUpdate(Options) {
  return function(dispatch, getState) {
    const unknownRegionsEdgeNode = 'The Redoubt';
    const widerGalaxyEdgeNode = 'Utegetu Nebula';
    const CurrentState = getState();
    const currentStartNode = CurrentState.hyperspaceStartNode.system;
    const currentEndNode = CurrentState.hyperspaceEndNode.system;
    const checkConnectionToStartNode = (currentStartNode && !Options.isStartPosition)? true : false;
    const checkConnectionToEndNode = (currentEndNode && Options.isStartPosition)? true : false;
    if(checkConnectionToStartNode || checkConnectionToEndNode) {
      const testStartNode = (checkConnectionToStartNode && !checkConnectionToEndNode)? true : false;
      const NodeToTest = (testStartNode)? CurrentState.hyperspaceStartNode : CurrentState.hyperspaceEndNode;
      const NodeSearchPlace = {
        lat: Options.NewNodeState.lat,
        lng: Options.NewNodeState.lng
      };
      const NodeFixedPlace = {
        lat: NodeToTest.lat,
        lng: NodeToTest.lng
      };

      ApiService.placesConnected([NodeFixedPlace, NodeSearchPlace]).then(connectionData => {
        if(connectionData.connected) {
          dispatch(setHyperspaceState(Options));
        } else {
          connectionToCoruscantAndCsilla(NodeSearchPlace).then(NodeSearchData => {
            connectionToCoruscantAndCsilla(NodeFixedPlace).then(NodeFixedData => {
              const fixedConnectedToCoruscantButNotCsilla = NodeFixedData.connectionCoruscant && !NodeFixedData.connectionCsilla;
              const fixedConnectedToCsillaButNotCoruscant = NodeFixedData.connectionCsilla && !NodeFixedData.connectionCoruscant;
              const searchConnectedToCoruscantButNotCsilla = NodeSearchData.connectionCoruscant && !NodeSearchData.connectionCsilla;
              const searchConnectedToCsillaButNotCoruscant = NodeSearchData.connectionCsilla && !NodeSearchData.connectionCoruscant;
              const searchHasOneNetworkConnection = (xor(searchConnectedToCoruscantButNotCsilla, searchConnectedToCsillaButNotCoruscant))? true : false;
              const fixedHasOneNetworkConnection = (xor(fixedConnectedToCoruscantButNotCsilla, fixedConnectedToCsillaButNotCoruscant))? true : false;
              if(searchHasOneNetworkConnection && fixedHasOneNetworkConnection) {
                const UnknownRegionsEndPlace = new Place({
                  system: 'The Redoubt',
                  emptySpace: false,
                  isStartPosition: false
                });
                const WiderGalaxyEndPlace = new Place({
                  system: 'Utegetu Nebula',
                  emptySpace: false,
                  isStartPosition: false
                });
                if(Options.isStartPosition) {
                  const NewEndPlace = (searchConnectedToCoruscantButNotCsilla)? WiderGalaxyEndPlace : UnknownRegionsEndPlace;
                  createNodeAndPositionObjects(NewEndPlace).then(EndNodeAndPoint => {
                    dispatch(setHyperspaceState({
                      isStartPosition: false,
                      NewNodeState: EndNodeAndPoint.NewNodeState,
                      NewPositionState: EndNodeAndPoint.NewPositionState,
                      system: EndNodeAndPoint.NewPositionState.system
                    }));
                    dispatch(setHyperspaceState({
                      isStartPosition: Options.isStartPosition,
                      NewNodeState: Options.NewNodeState,
                      NewPositionState: Options.NewPositionState,
                      system: Options.NewPositionState.system
                    }));
                    dispatch(addItemToDataStream('Jumping to ' + EndNodeAndPoint.NewPositionState.system + ' instead'));
                  }).catch(errorNewEnd => {
                    console.log("errorNewEnd: ", errorNewEnd);
                  });
                } else {
                  const NewEndPlace = (fixedConnectedToCoruscantButNotCsilla)? WiderGalaxyEndPlace : UnknownRegionsEndPlace;
                  createNodeAndPositionObjects(NewEndPlace).then(EndNodeAndPoint => {
                    dispatch(setHyperspaceState({
                      isStartPosition: false,
                      NewNodeState: EndNodeAndPoint.NewNodeState,
                      NewPositionState: EndNodeAndPoint.NewPositionState,
                      system: EndNodeAndPoint.NewPositionState.system
                    }));
                    dispatch(addItemToDataStream('Jumping to ' + EndNodeAndPoint.NewPositionState.system + ' instead'));
                  }).catch(errorNewEnd => {
                    console.log("errorNewEnd: ", errorNewEnd);
                  });
                }
              }
            }).catch(errorFixed => {
              console.log("errorFixed: ", errorFixed);
            });

          }).catch(err => {
            console.log("err: ", err);
          });
        }
      });
    } else {
      dispatch(setHyperspaceState(Options));
    }
    return null;
  }
}

function xor(){
  let b = false;
  for( var j = 0; j < arguments.length; j++ )
  {
    if( arguments[ j ] && !b ) b = true;
    else if( arguments[ j ] && b ) return false;
  }
  return b;
};

async function createNodeAndPositionObjects(PlaceObject) {
  try {
    const NearestNode = await ApiService.findNearestNodeOfPoint(PlaceObject.searchQuery());
    const NewNodeState = createNodeState(NearestNode);
    const NewPositionState = await createPositionObject(PlaceObject);
    return {
      NewPositionState: NewPositionState,
      NewNodeState: NewNodeState
    };
  } catch(err) {
    console.log("error: ", err);
  }
}

async function createPositionObject(PlaceObject) {
  try {
    if(PlaceObject.emptySpace) {
      return PlaceObject.positionState();
    } else {
      const PlanetData = await ApiService.findSystemByName(PlaceObject.system);
      return createPositionFromPlanet(PlanetData);
    }
  } catch(err) {
    console.log("error: ", err);
  }
}

async function connectionToCoruscantAndCsilla(NodeToTest) {
  try {
    const NodeLocation = {
      lat: NodeToTest.lat,
      lng: NodeToTest.lng
    };
    const CoruscantStatus = await ApiService.placesConnected([NodeLocation, {system: 'Coruscant'}]);
    const CsillaStatus = await ApiService.placesConnected([NodeLocation, {system: 'Csilla'}]);
    return {
      connectionCoruscant: CoruscantStatus.connected,
      connectionCsilla: CsillaStatus.connected
    };
  } catch(err) {
    console.log("error: ", err);
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
  return omit(NodeData, ['_id', '__v', 'loc', 'geoHash', 'distanceFromPoint', 'distanceFromPointNormalized']);
}
