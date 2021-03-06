import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { createStore, combineReducers } from 'redux';
import Actions from '../constants/actionTypesModule.js';

import Logger from '../classes/logger.js';

const LoggerInstance = new Logger();
LoggerInstance.setInActive();


/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

let storeTest = createStore(counter);

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

storeTest.subscribe(() => {
  LoggerInstance.log(storeTest.getState());
});

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
storeTest.dispatch({ type: 'INCREMENT' });
// 1
storeTest.dispatch({ type: 'INCREMENT' });
// 2
storeTest.dispatch({ type: 'DECREMENT' });
// 1
const reduxStatus = (storeTest.getState() === 1)? "redux on" : "redux off";
LoggerInstance.log(reduxStatus);


const CoruscantLocationZoomOne = {
	center: [0.00, 0.00],
	zoom: 1
};
const CoruscantLocation = {
	center: [0.00, 0.00],
	zoom: 2
};
const CoruscantSystem = {
	lat: 0.00,
	lng: 0.00,
	zoom: 2,
	system: 'Coruscant',
	xGalactic: 0.00,
	yGalactic: 0.00,
	emptySpace: false,
	coordinates: 'L9',
	sector: 'Unknown',
	region: 'Core',
	link: 'http://starwars.wikia.com/wiki/Coruscant'
};
const BlankPoint = {
	system: '',
	lat: null,
	lng: null,
	xGalactic: null,
	yGalactic: null,
	xGalacticLong: null,
	yGalacticLong: null,
	zoom: null,
	emptySpace: null,
	coordinates: '',
  sector: [null],
  region: '',
  link: ''
};
const BlankNode = {
	system: '',
	lat: null,
	lng: null,
	hyperspaceLanes: [],
	nodeId: null,
	xGalactic: null,
	yGalactic: null,
	xGalacticLong: null,
	yGalacticLong: null,
	zoom: null,
	emptySpace: null
};
const DefaultDataStream = {
	deCodedIndex: 18,
	currentItem: 'Welcome to The Galaxy',
	streamItemArrray: []
};
const BlankGalacticXandY = {
	xGalactic: null,
	yGalactic: null
};
const BlankLocation = {
	lat: null,
	lng: null
};
const BlankSector = {
	coordinates: [],
	name: null,
	link: ''
};
const BlankHyperspaceRoute = {
	coordinates: [],
	name: null,
	link: '',
	length: null
};
const NullBoundaryObject = {
	_northEast: {
		lat: null,
		lng: null
	},
	_southWest: {
		lat: null,
		lng: null
	}
};
const blankSearchValue = '';
const maxJumps = 90;
const pathLimit = 1;
const emptyMapHash = null;
const nullHyperspaceHash = null;
const emptyNameSet = new Set();


function zoomToLocationAndPan(state = false,  action) {
	switch (action.type) {
		case Actions.ZOOM_TO_AND_PAN_ON:
			return true;
		case Actions.ZOOM_TO_AND_PAN_OFF:
			return false;
		default:
			return state;
	}
}
function zoomChange(state = false, action) {
	switch (action.type) {
		case Actions.ZOOM_CHANGE_ON:
			return true;
		case Actions.ZOOM_CHANGE_OFF:
			return false;
		default:
			return state;
	}
}
function selectFocused(state = false, action) {
	switch (action.type) {
		case Actions.SELECT_FOCUSED:
			return true;
		case Actions.SELECT_BLURRED:
			return false;
		default:
			return state;
	}
}
function mobileStatus(state = false, action) {
	switch (action.type) {
		case Actions.MOBILE_STATUS_ON:
			return true;
		case Actions.MOBILE_STATUS_OFF:
			return false;
		default:
			return state;
	}
}
function navigationObjectBoundaries(state = NullBoundaryObject, action) {
  switch (action.type) {
    case Actions.NEW_NAVIGATION_OBJECT_BOUNDARIES:
      return action.payload;
    case Actions.NO_NAVIGATION_OBJECT_BOUNDARIES:
      return NullBoundaryObject;
    default:
      return state;
  }
}
function currentSeachValue(state = blankSearchValue, action) {
	switch (action.type) {
		case Actions.CURRENT_SEARCH_VALUE_IS_SYSTEMS:
			return 'systems';
		case Actions.CURRENT_SEARCH_VALUE_IS_SECTORS:
			return 'sectors';
		case Actions.CURRENT_SEARCH_VALUE_IS_LANES:
			return 'lanes';
		case Actions.NO_CURRENT_SEARCH_VALUE:
			return blankSearchValue;
		default:
			return state;
	}
}
function searchObjectBoundaries(state = NullBoundaryObject, action) {
	switch (action.type) {
		case Actions.NEW_SEARCH_OBJECT_BOUNDARIES:
			return action.payload;
		case Actions.NO_SEARCH_OBJECT_BOUNDARIES:
			return NullBoundaryObject;
		default:
			return state;
	}
}
function hyperspaceRouteSearchData(state = BlankHyperspaceRoute, action) {
	switch (action.type) {
		case Actions.NEW_HYPERSPACE_ROUTE_DATA:
			return action.payload;
		case Actions.NO_HYPERSPACE_ROUTE_DATA:
			return BlankHyperspaceRoute;
		default:
			return state;
	}
}
function hyperspaceRouteNameSet(state = emptyNameSet, action) {
	switch (action.type) {
		case Actions.BUILD_HYPERSPACE_ROUTE_NAME_SET:
			const newHyperspaceRouteNameSet = action.payload;
			return newHyperspaceRouteNameSet;
		case Actions.EMPTY_HYPERSPACE_ROUTE_NAME_SET:
			return emptyNameSet;
		default:
			return state;
	}
}
function sectorSearchData(state = BlankSector, action) {
	switch (action.type) {
		case Actions.NEW_SECTOR_DATA:
			return action.payload;
		case Actions.NO_SECTOR_DATA:
			return BlankSector;
		default:
			return state;
	}
}
function systemsSearchLocation(state = BlankLocation, action) {
	switch (action.type) {
		case Actions.NEW_SYSTEMS_SEARCH_LOCATION:
			return action.payload;
		case Actions.NO_SYSTEMS_SEARCH_LOCATION:
			return BlankLocation;
		default:
			return state;
	}
}
function searchSystems(state = false, action) {
	switch (action.type) {
		case Actions.SEARCH_SYSTEMS_ON:
			return true;
		case Actions.SEARCH_SYSTEMS_OFF:
			return false;
		default:
			return state;
	}
}
function activeSystem(state = BlankPoint, action) {
	let StateClone = _.cloneDeep(state);
	switch (action.type) {
		case Actions.SET_SYSTEM:
			if(action.payload.zoom === 2) {
				return CoruscantSystem;
			} else {
				return action.payload;
			}
		case Actions.INCREMENT_SYSTEM_ZOOM:
			StateClone.zoom += 1;
			return StateClone;
		case Actions.DECREMENT_SYSTEM_ZOOM:
			StateClone.zoom -= 1;
			return StateClone;
		case Actions.SET_SYSTEM_ZOOM_VALUE:
			if(action.payload.zoom === 2) {
				return CoruscantSystem;
			} else {
				StateClone.zoom = action.payload;
				return StateClone;
			}
		case Actions.SET_SYSTEM_ERROR:
			return state;
		case Actions.SET_SYSTEM_TO_CORUSCANT:
			return CoruscantSystem;
		case Actions.SET_DEFAULT_SYSYTEM:
			return BlankPoint;
		default:
			return state;
	}
}
function systemsSearchControlsOn(state = false, action) {
	switch (action.type) {
		case Actions.SYSTEMS_SEARCH_CONTROLS_ON:
			return true;
		case Actions.SYSTEMS_SEARCH_CONTROLS_OFF:
			return false;
		case Actions.SYSTEMS_SEARCH_CONTROLS_TOGGLE:
			let newState = (state)? false : true;
			return newState;
		default:
			return state;
	}
}
function systemNameSet(state = emptyNameSet, action) {
	switch (action.type) {
		case Actions.BUILD_SYSTEM_NAME_SET:
			const newSystemNameSet = action.payload;
			return newSystemNameSet;
		case Actions.EMPTY_SYSTEM_NAME_SET:
			return emptyNameSet;
		default:
			return state;
	}
}
function sectorSearchSet(state = emptyNameSet, action) {
	switch (action.type) {
		case Actions.ADD_SECTOR_SEARCH_SET:
			let SetClone = new Set(state);
			SetClone.add(action.payload);
			return SetClone;
		case Actions.BUILD_SECTOR_SEARCH_SET:
			const newSectorSearchSet = action.payload;
			return newSectorSearchSet;
		case Actions.EMPTY_SECTOR_SEARCH_SET:
			return emptyNameSet;
		default:
			return state;
	}
}


function loadingIconOn(state = false, action) {
	switch (action.type) {
		case Actions.LOADING_ICON_ON:
			return true;
		case Actions.LOADING_ICON_OFF:
			return false;
		default:
			return state;
	}
}
function dataStream(state = DefaultDataStream, action) {
	let StateClone = _.cloneDeep(state);
	switch (action.type) {
		case Actions.ADD_DATA_STREAM_ITEM:
			StateClone.currentItem = action.payload;
			StateClone.streamItemArrray.unshift(action.payload);
			if(StateClone.streamItemArrray.length > 10) {
				StateClone.streamItemArrray.pop();
			}
			StateClone.deCodedIndex = 0;
			return StateClone;
		case Actions.SET_CURRENT_DATA_STREAM_ITEM_TEMP:
			StateClone.currentItem = action.payload;
			return StateClone;
		case Actions.SET_CURRENT_DATA_STREAM_ITEM_TO_MOST_RECENT:
			StateClone.currentItem = StateClone.streamItemArrray[0];
			return StateClone;
		case Actions.SET_CURRENT_DATA_STREAM_ITEM_TO_BLANK:
			StateClone.currentItem = '';
			return StateClone;
		case Actions.DECODE_ADDITIONAL_LETTER:
			if(StateClone.deCodedIndex < StateClone.currentItem.length) {
				StateClone.deCodedIndex += 1;
			}			
			return StateClone;
		case Actions.RE_ENCODE_PREVIOUS_LETTER:
			if(StateClone.deCodedIndex > 0) {
				StateClone.deCodedIndex -= 1;
			}
			return StateClone;
		case Actions.ZERO_DECODE_LETTERS:
			StateClone.deCodedIndex = 0;
			return StateClone;
		default:
			return state;
	}
}
function cursorValue(state = '', action) {
	switch (action.type) {
		case Actions.CURSOR_DEFAULT:
			return '';
		case Actions.CURSOR_CROSSHAIR:
			return 'crosshair';
		case Actions.CURSOR_NOT_ALLOWED:
			return 'not-allowed';
		case Actions.CURSOR_POINTER:
			return 'pointer';
		default:
			return state;
	}
}
function cursorOnMap(state = false, action) {
	switch (action.type) {
		case Actions.MOUSE_MOVE_OFF_MAP:
			return false;
		case Actions.MOUSE_MOVE_ONTO_MAP:
			return true;
		default:
			return state;			
	}
}
function galacticXandY(state = BlankGalacticXandY, action) {
	switch (action.type) {
		case Actions.MOUSE_MOVE:
			return action.payload;
		default:
			return state;			
	}
}
function mapControlsDisplayed(state = true, action) {
	switch (action.type) {
		case Actions.DISPLAY_MAP_CONTROLS:
			return true;
		case Actions.HIDE_MAP_CONTROLS:
			return false;
		default:
			return state;			
	}
}
function mapCenterAndZoom(state = CoruscantLocation, action) {
	let StateClone = _.cloneDeep(state);
	switch (action.type) {
		case Actions.SET_MAP_CENTER:
			StateClone.center = action.payload;
			return StateClone;
		case Actions.SET_MAP_ZOOM:
			StateClone.zoom = action.payload;
			return StateClone;
		case Actions.SET_MAP_CENTER_AND_ZOOM:
			StateClone.center = action.payload.center;
			StateClone.zoom = action.payload.zoom;
			return StateClone;
		case Actions.INCREASE_MAP_ZOOM_BY_ONE:
			StateClone.zoom += 1;
			return StateClone;
		case Actions.DECREASE_MAP_ZOOM_BY_ONE:
			StateClone.zoom -= 1;
			return StateClone;
		case Actions.SET_MAP_CENTER_AND_ZOOM_TO_DEFAULT:
			return CoruscantLocation;
		case Actions.SET_MAP_CENTER_AND_ZOOM_TO_ONE:
			return CoruscantLocationZoomOne;
		default:
			return state;	
	}
}
function southWestMapHash(state = emptyMapHash, action) {
	switch (action.type) {
		case Actions.UPDATE_SOUTH_WEST_MAP_HASH:
			const newMapHash = action.payload;
			return newMapHash;
		case Actions.CLEAR_SOUTH_WEST_MAP_HASH:
			return emptyMapHash;
		default:
			return state;
	}
}
function northEastMapHash(state = emptyMapHash, action) {
	switch (action.type) {
		case Actions.UPDATE_NORTH_EAST_MAP_HASH:
			const newMapHash = action.payload;
			return newMapHash;
		case Actions.CLEAR_NORTH_EAST_MAP_HASH:
			return emptyMapHash;
		default:
			return state;
	}
}


function activeHyperspaceJump(state = nullHyperspaceHash, action) {
	switch (action.type) {
		case Actions.SET_ACTIVE_HYPERSPACE_JUMP:
			const hyperspaceHash = action.payload;
			return hyperspaceHash;
		case Actions.SET_NULL_ACTIVE_HYPERSPACE_JUMP:
			return nullHyperspaceHash;
		default:
			return state;
	}	
}
function hyperspaceHash(state = nullHyperspaceHash, action) {
	switch (action.type) {
		case Actions.SET_SELECTED_HYPERSPACE_HASH:
			const hyperspaceHash = action.payload;
			return hyperspaceHash;
		case Actions.SET_NULL_HYPERSPACE_HASH:
			return nullHyperspaceHash;
		default:
			return state;			
	}
}
function hyperspaceNavigationControlsOn(state = false, action) {
	switch (action.type) {
		case Actions.HYPERSPACE_NAVIGATION_CONTROLS_ON:
			return true;
		case Actions.HYPERSPACE_NAVIGATION_CONTROLS_OFF:
			return false;
		case Actions.HYPERSPACE_NAVIGATION_CONTROLS_TOGGLE:
			let newState = (state)? false : true;
			return newState;
		default:
			return state;
	}
}
function hyperspacePathCollections(state = [], action) {
	switch (action.type) {
		case Actions.LOAD_HYPERSPACE_COLLECTION:
			if(Array.isArray(action.payload)) {
				return action.payload;
			} else {
				return [action.payload];
			}
		case Actions.EMPTY_HYPERSPACE_COLLECTION:
			return [];
		case Actions.ADD_HYPERSPACE_COLLECTION:
			const stateClone = _.cloneDeep(state);
			stateClone.push(action.payload);
			return stateClone;
		case Actions.ERROR_HYPERSPACE_COLLECTION:
			return state;
		default:
			return state;
	}
}
function shipHyperspaceJumpPath(state = [], action) {
	switch (action.type) {
		case Actions.LOAD_SHIP_HYPERSPACE_PATH:
			if(Array.isArray(action.payload)) {
				return action.payload;
			} else {
				return [action.payload];
			}
		case Actions.EMPTY_SHIP_HYPERSPACE_PATH:
			return [];
		case Actions.ADD_SHIP_HYPERSPACE_PATH:
			const stateClone = _.cloneDeep(state);
			stateClone.push(action.payload);
			return stateClone;
		case Actions.ERROR_SHIP_HYPERSPACE_PATH:
			return state;
		default:
			return state;
	}
}
function shipHasJumpedToHyperspace(state = false, action) {
	switch (action.type) {
		case Actions.SHIP_HAS_JUMPED_TO_HYPERSPACE:
			return true;
		case Actions.SHIP_IS_IN_HYPERSPACE:
			return false;
		case Actions.SHIP_HAS_EXITED_HYPERSPACE:
			return false;
		case Actions.SHIP_IS_IN_REAL_SPACE:
			return false;
		default:
			return state;
	}
}
function zoomToShip(state = false, action) {
	switch (action.type) {
		case Actions.ZOOM_TO_SHIP_ON:
			return true;
		case Actions.ZOOM_TO_SHIP_OFF:
			return false;
		case Actions.ZOOM_TO_SHIP_DEFAULT:
			return false;
		default:
			return state;
	}
}



function hyperspacePathChange(state = false, action) {
	switch (action.type) {
		case Actions.HYPERSPACE_PATH_CHANGE_ON:
			return true;
		case Actions.HYPERSPACE_PATH_CHANGE_OFF:
			return false;
		case Actions.HYPERSPACE_PATH_CHANGE_STATUS:
			return state;
		default:
			return state;
	}
}
function hyperspaceStartPoint(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_START_POSITION:
			return action.payload;
		case Actions.SET_START_POSITION_ERROR:
			return state;
		case Actions.SET_DEFAULT_START_POSITION:
			return BlankPoint;
		default:
			return state;	

	}
}
function hyperspaceEndPoint(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_END_POSITION:
			return action.payload;
		case Actions.SET_END_POSITION_ERROR:
			return state;
		case Actions.SET_DEFAULT_END_POSITION:
			return BlankPoint;
		default:
			return state;	
	}
}
function hyperspaceStartNode(state = BlankNode, action) {
	switch (action.type) {
		case Actions.SET_START_NODE:
			return action.payload;
		case Actions.SET_START_NODE_ERROR:
			return state;
		case Actions.SET_DEFAULT_START_NODE:
			return BlankNode;
		default:
			return state;	

	}
}
function hyperspaceEndNode(state = BlankNode, action) {
	switch (action.type) {
		case Actions.SET_END_NODE:
			return action.payload;
		case Actions.SET_END_NODE_ERROR:
			return state;
		case Actions.SET_DEFAULT_END_NODE:
			return BlankNode;
		default:
			return state;	
	}
}
function hyperspaceActiveStartPoint(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_ACTVIE_START_POSITION:
			return action.payload;
		case Actions.SET_ACTVIE_START_POSITION_DEFAULT:
			return BlankPoint;
		default:
			return state;
	}
}
function hyperspaceActiveEndPoint(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_ACTVIE_END_POSITION:
			return action.payload;
		case Actions.SET_ACTVIE_END_POSITION_DEFAULT:
			return BlankPoint;
		default:
			return state;	
	}
}
function hyperspaceActiveStartNode(state = BlankNode, action) {
	switch (action.type) {
		case Actions.SET_ACTVIE_START_NODE:
			return action.payload;
		case Actions.SET_ACTVIE_START_NODE_DEFAULT:
			return BlankNode;
		default:
			return state;
	}
}
function hyperspaceActiveEndNode(state = BlankNode, action) {
	switch (action.type) {
		case Actions.SET_ACTVIE_END_NODE:
			return action.payload;
		case Actions.SET_ACTVIE_END_NODE_DEFAULT:
			return BlankNode;
		default:
			return state;
	}
}
function hyperspacePointZoomOn(state = false, action) {
	switch (action.type) {
		case Actions.HYPERSPACE_POINT_ZOOM_ON:
			return true;
		case Actions.HYPERSPACE_POINT_ZOOM_OFF:
			return false;
		default:
			return state;	
	}
}
function hyperspaceMaxJumps(state = maxJumps, action) {
	switch (action.type) {
		case Actions.SET_MAX_JUMPS:
			return action.payload;
		case Actions.SET_MAX_JUMPS_ERROR:
			return state;
		default:
			return state;	
	}
}
function calculateHyperspaceJump(state = false, action) {
	switch (action.type) {
		case Actions.CALCULATE_HYPERSPACE_JUMP_ON:
			return true;
		case Actions.CALCULATE_HYPERSPACE_JUMP_OFF:
			return false;
		default:
			return state;
	}
}
function pathSearchStart(state = false, action) {
	switch (action.type) {
		case Actions.PATH_SEARCH_START_ON:
			return true;
		case Actions.PATH_SEARCH_START_OFF:
			return false;
		default:
			return state;
	}
}
function pathSearchEnd(state = false, action) {
	switch (action.type) {
		case Actions.PATH_SEARCH_END_ON:
			return true;
		case Actions.PATH_SEARCH_END_OFF:
			return false;
		default:
			return state;
	}
}
function pinPointStart(state = false, action) {
	switch (action.type) {
		case Actions.PIN_POINT_START_ON:
			return true;
		case Actions.PIN_POINT_START_OFF:
			return false;
		case Actions.PIN_POINT_START_TOGGLE:
			return (state)? false : true;

		default:
			return state;
	}	
}
function pinPointEnd(state = false, action) {
	switch (action.type) {
		case Actions.PIN_POINT_END_ON:
			return true;
		case Actions.PIN_POINT_END_OFF:
			return false;
		case Actions.PIN_POINT_END_TOGGLE:
			return (state)? false : true;

		default:
			return state;
	}	
}
function pathStartClick(state = false, action) {
	switch (action.type) {
		case Actions.PATH_START_CLICK_ON:
			return true;
		case Actions.PATH_START_CLICK_OFF:
			return false;
		case Actions.PATH_START_CLICK_TOGGLE:
			return (state)? false : true;
		default:
			return state;
	}	
}
function pathEndClick(state = false, action) {
	switch (action.type) {
		case Actions.PATH_END_CLICK_ON:
			return true;
		case Actions.PATH_END_CLICK_OFF:
			return false;
		case Actions.PATH_END_CLICK_TOGGLE:
			return (state)? false : true;

		default:
			return state;
	}
}
function hyperspaceStartSystem(state = '', action) {
	switch (action.type) {
		case Actions.SET_START_SYSTEM:
			return action.payload;
		case Actions.SET_START_SYSTEM_ERROR:
			return state;
		case Actions.SET_START_SYSTEM_EMPTY:
			return '';
		default:
			return state;
	}	
}
function hyperspaceEndSystem(state = '', action) {
	switch (action.type) {
		case Actions.SET_END_SYSTEM:
			return action.payload;
		case Actions.SET_END_SYSTEM_ERROR:
			return state;
		case Actions.SET_END_SYSTEM_EMPTY:
			return '';
		default:
			return state;
	}	
}
function updateHyperspaceNavigation(state = false, action) {
	switch (action.type) {
		case Actions.UPDATE_HYPERSPACE_NAVIGATION_ON:
			return true;
		case Actions.UPDATE_HYPERSPACE_NAVIGATION_OFF:
			return false;
		case Actions.SET_ACTIVE_HYPERSPACE_JUMP:
			return true;
		default:
			return state;
	}
}
function freeSpaceJumpStart(state = false, action) {
	switch (action.type) {
		case Actions.FREE_SPACE_JUMP_START_ON:
			return true;
		case Actions.FREE_SPACE_JUMP_START_OFF:
			return false;
		case Actions.SET_DEFAULT_FREE_SPACE_JUMP_START:
			return false;
		default:
			return state;
	}
}
function freeSpaceJumpEnd(state = false, action) {
	switch (action.type) {
		case Actions.FREE_SPACE_JUMP_END_ON:
			return true;
		case Actions.FREE_SPACE_JUMP_END_OFF:
			return false;
		case Actions.SET_DEFAULT_FREE_SPACE_JUMP_END:
			return false;
		default:
			return state;
	}
}



function starMapOverlayStatus(state = true, action) {
	switch (action.type) {
		case Actions.STAR_MAP_ON:
			return true;
		case Actions.STAR_MAP_OFF:
			return false;
		default:
			return state;
	}
}
function sectorMapOverlayStatus(state = false, action) {
	switch (action.type) {
		case Actions.SECTOR_MAP_ON:
			return true;
		case Actions.SECTOR_MAP_OFF:
			return false;
		default:
			return state;
	}
}
function blackBaseMapOverlayStatus(state = false, action) {
  switch (action.type) {
    case Actions.BLACK_BASE_MAP_ON:
      return true;
    case Actions.BLACK_BASE_MAP_OFF:
      return false;
    default:
      return state;
  }
}
function galaxyBaseMapOverlayStatus(state = true, action) {
  switch (action.type) {
    case Actions.GALAXY_BASE_MAP_ON:
      return true;
    case Actions.GALAXY_BASE_MAP_OFF:
      return false;
    default:
      return state;
  }
}
function baseLayerName(state = "Galaxy", action) {
  switch (action.type) {
    case Actions.BASE_LAYER_GALAXY:
      return "Galaxy";
    case Actions.BASE_LAYER_BLACK:
      return "Black";
    case Actions.BASE_LAYER_WHITE:
      return "White";
    default:
      return state;
  }
}

export default combineReducers({
	zoomToLocationAndPan,
	zoomChange,
	selectFocused,
	mobileStatus,
	navigationObjectBoundaries,
	currentSeachValue,
	searchObjectBoundaries,
	hyperspaceRouteSearchData,
	sectorSearchData,
	systemsSearchLocation,
	galaxyBaseMapOverlayStatus,
	blackBaseMapOverlayStatus,
	baseLayerName,
	sectorMapOverlayStatus,
	starMapOverlayStatus,
	loadingIconOn,
	cursorValue,
	cursorOnMap,
	galacticXandY,
	sectorSearchSet,
	systemNameSet,
	hyperspaceRouteNameSet,
	hyperspacePointZoomOn,
	hyperspaceActiveStartPoint,
	hyperspaceActiveEndPoint,
	hyperspaceActiveStartNode,
	hyperspaceActiveEndNode,
	activeHyperspaceJump,
	hyperspaceHash,
	southWestMapHash,
	northEastMapHash,
	dataStream,
	systemsSearchControlsOn,
	hyperspaceNavigationControlsOn,
	activeSystem,
	searchSystems,
	hyperspacePathCollections,
	shipHyperspaceJumpPath,
	shipHasJumpedToHyperspace,
	zoomToShip,
	hyperspacePathChange,
	pathSearchStart,
	pathSearchEnd,
	hyperspaceStartPoint,
	hyperspaceEndPoint,
	hyperspaceStartNode,
	hyperspaceEndNode,
	hyperspaceStartSystem,
	hyperspaceEndSystem,
	hyperspaceMaxJumps,
	pinPointStart,
	pinPointEnd,
	pathStartClick,
	pathEndClick,
	calculateHyperspaceJump,
	updateHyperspaceNavigation,
	freeSpaceJumpStart,
	freeSpaceJumpEnd,
	mapCenterAndZoom,
	mapControlsDisplayed
});