import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import multi from 'redux-multi';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as Actions from '../constants/actionTypes.js';

// applyMiddleware(multi)(createStore);

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
  console.log(storeTest.getState());
});

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
storeTest.dispatch({ type: 'INCREMENT' });
// 1
storeTest.dispatch({ type: 'INCREMENT' });
// 2
storeTest.dispatch({ type: 'DECREMENT' });
// 1
console.log( (storeTest.getState() === 1)? "redux on" : "redux off" );

const CoruscantLocation = {
	center: [0, 0],
	zoom: 2
};

const CoruscantSystem = {
	lat: 0,
	lng: 0,
	zoom: 2,
	system: 'Coruscant'
};

const BlankPoint = {
	system: '',
	lat: null,
	lng: null
};

const BlankNode = {
	system: '',
	lat: null,
	lng: null,
	hyperspaceLanes: [],
	loc: [],
	nodeId: null
};
const DefaultDataStream = {
	deCodedIndex: 18,
	currentItem: 'Death to Sith Fags',
	streamItemArrray: []
};
const defaultZoom = 2;
const maxJumps = 90;
const pathLimit = 1;


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
			console.log("New Data Stream Item: ", StateClone.currentItem);
			return StateClone;
		case Actions.SET_CURRENT_DATA_STREAM_ITEM_TEMP:
			StateClone.currentItem = action.payload;
			console.log("Temporary data stream item: ", StateClone.currentItem);
			return StateClone;
		case Actions.SET_CURRENT_DATA_STREAM_ITEM_TO_MOST_RECENT:
			StateClone.currentItem = StateClone.streamItemArrray[0];
			console.log("Most recent data stream item: ", StateClone.currentItem);
			return StateClone;
		case Actions.SET_CURRENT_DATA_STREAM_ITEM_TO_BLANK:
			StateClone.currentItem = '';
			console.log("Data Stream now blank");
			return StateClone;
		case Actions.DECODE_ADDITIONAL_LETTER:
			if(StateClone.deCodedIndex < StateClone.currentItem.length) {
				StateClone.deCodedIndex += 1;
			}			
			console.log("Current Data Stream item decoded");
			return StateClone;
		case Actions.RE_ENCODE_PREVIOUS_LETTER:
			if(StateClone.deCodedIndex > 0) {
				StateClone.deCodedIndex -= 1;
			}
			console.log("Current Data Stream item re-encoded");
			return StateClone;
		case Actions.ZERO_DECODE_LETTERS:
			StateClone.deCodedIndex = 0;
			console.log("Current Data Stream item has not been decoded");
			return StateClone;
		default:
			return state;
	}
}


function systemsSearchControlsOn(state = false, action) {
	switch (action.type) {
		case Actions.SYSTEMS_SEARCH_CONTROLS_ON:
			console.log("System search controls on");
			return true;
		case Actions.SYSTEMS_SEARCH_CONTROLS_OFF:
			console.log("System search controls off");
			return false;
		case Actions.SYSTEMS_SEARCH_CONTROLS_TOGGLE:
			let newState = (state)? false : true;
			console.log("System search controls toggled to: ", newState);
			return newState;
		default:
			return state;
	}
}

function mapControlsOn(state = true, action) {
	switch (action.type) {
		case Actions.MAP_CONTROLS_ON:
			console.log("map controls on");
			return true;
		case Actions.MAP_CONTROLS_OFF:
			console.log("map controls off");
			return false;
		case Actions.MAP_CONTROLS_TOGGLE:
			let newState = (state)? false : true;
			console.log("map controls toggled to: ", newState);
			return newState;
		default:
			return state;
	}
}

function hyperspaceNavigationControlsOn(state = false, action) {
	switch (action.type) {
		case Actions.HYPERSPACE_NAVIGATION_CONTROLS_ON:
			console.log("Hyperspace navigation controls on");
			return true;
		case Actions.HYPERSPACE_NAVIGATION_CONTROLS_OFF:
			console.log("Hyperspace navigation controls off");
			return false;
		case Actions.HYPERSPACE_NAVIGATION_CONTROLS_TOGGLE:
			let newState = (state)? false : true;
			console.log("Hyperspace navigation controls toggled to: ", newState);
			return newState;
		default:
			return state;
	}
}

function activeSystem(state = CoruscantSystem, action) {
	let StateClone = _.cloneDeep(state);
	switch (action.type) {
		case Actions.SET_SYSTEM:
			console.log("zoom to system state: ", action.payload);
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
			console.log("zoom to system error: ", action.payload);
			return state;
		case Actions.SET_SYSTEM_TO_CORUSCANT:
			return CoruscantSystem;
		default:
			return state;
	}
}


function mapCenterAndZoom(state = CoruscantLocation, action) {
	let StateClone = _.cloneDeep(state);
	switch (action.type) {
		case Actions.SET_MAP_CENTER:
			console.log("set map center: ", action.payload);
			StateClone.center = action.payload;
			return StateClone;
		case Actions.SET_MAP_ZOOM:
			console.log("set map zoom: ", action.payload);
			StateClone.zoom = action.payload;
			return StateClone;
		case Actions.SET_MAP_CENTER_AND_ZOOM:
			StateClone.center = action.payload.center;
			StateClone.zoom = action.payload.zoom;
			console.log("set map zoom and center: ", StateClone);
			return StateClone;
		case Actions.INCREASE_MAP_ZOOM_BY_ONE:
			StateClone.zoom += 1;
			console.log("increase map zoom by one: ", StateClone);
			return StateClone;
		case Actions.DECREASE_MAP_ZOOM_BY_ONE:
			StateClone.zoom -= 1;
			console.log("decrease map zoom by one: ", StateClone);
			return StateClone;
		case Actions.SET_MAP_CENTER_AND_ZOOM_TO_DEFAULT:
			console.log("setting map to Coruscant at Galactic Level");
			return CoruscantLocation;
		default:
			return state;	
	}
}

function hyperspacePathCollections(state = [], action) {
	switch (action.type) {
		case Actions.LOAD_HYPERSPACE_COLLECTION:
			console.log("reducer load hyperspace collection: ", action.payload);
			if(Array.isArray(action.payload)) {
				return action.payload;
			} else {
				return [action.payload];
			}
		case Actions.EMPTY_HYPERSPACE_COLLECTION:
			console.log("reducer empty all hyperspace path collection: ", action.payload);
			return [];
		case Actions.ADD_HYPERSPACE_COLLECTION:
			console.log("reducer add hyperspace path collection: ", action.payload);
			const stateClone = _.cloneDeep(state);
			stateClone.push(action.payload);
			return stateClone;
		case Actions.ERROR_HYPERSPACE_COLLECTION:
			console.log("reducer Hyperspace path calculation error: ", action.payload);
			return state;
		default:
			return state;
	}
}
function hyperspacePathChange(state = false, action) {
	switch (action.type) {
		case Actions.HYPERSPACE_PATH_CHANGE_ON:
			console.log("Updating hyperspace paths: ", true);
			return true;
		case Actions.HYPERSPACE_PATH_CHANGE_OFF:
			console.log("Not Updating hyperspace paths: ", false);
			return false;
		case Actions.HYPERSPACE_PATH_CHANGE_STATUS:
			console.log("Hyperspace paths status: ", state);
			return state;
		default:
			return state;
	}
}
function hyperspaceStartPoint(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_START_POSITION:
			console.log("set hyperspaceStartPoint: ", action.payload);
			return action.payload;
		case Actions.SET_START_POSITION_ERROR:
			console.log("set hyperspaceStartPoint error: ", action.payload);
			return state;
		default:
			return state;	

	}
}
function hyperspaceEndPoint(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_END_POSITION:
			console.log("set hyperspaceEndPoint: ", action.payload);
			return action.payload;
		case Actions.SET_END_POSITION_ERROR:
			console.log("set hyperspaceEndPoint error: ", action.payload);
			return state;
		default:
			return state;	

	}
}
function hyperspaceStartNode(state = BlankNode, action) {
	switch (action.type) {
		case Actions.SET_START_NODE:
			console.log("set hyperspaceStartNode: ", action.payload);
			return action.payload;
		case Actions.SET_START_NODE_ERROR:
			console.log("set hyperspaceStartNode error: ", action.payload);
			return state;
		default:
			return state;	

	}
}
function hyperspaceEndNode(state = BlankNode, action) {
	switch (action.type) {
		case Actions.SET_END_NODE:
			console.log("set hyperspaceEndNode: ", action.payload);
			return action.payload;
		case Actions.SET_END_NODE_ERROR:
			console.log("set hyperspaceEndNode error: ", action.payload);
			return state;
		default:
			return state;	
	}
}
function hyperspaceMaxJumps(state = maxJumps, action) {
	switch (action.type) {
		case Actions.SET_MAX_JUMPS:
			console.log("set max jumps state: ", action.payload);
			return action.payload;
		case Actions.SET_MAX_JUMPS_ERROR:
			console.log("set max jumps error: ", action.payload);
			return state;
		default:
			return state;	
	}
}
function hyperspacePathNumber(state = pathLimit, action) {
	switch (action.type) {
		case Actions.SET_PATH_NUMBER:
			console.log("set total paths state: ", action.payload);
			return action.payload;
		case Actions.SET_PATH_NUMBER_ERROR:
			console.log("set total paths error: ", action.payload);
			return state;
		default:
			return state;	
	}
}
function searchSystems(state = false, action) {
	switch (action.type) {
		case Actions.SEARCH_SYSTEMS_ON:
			console.log("searching systems: ", true);
			return true;
		case Actions.SEARCH_SYSTEMS_OFF:
			console.log("searching systems: ", false);
			return false;
		default:
			return state;
	}
}
function calculateHyperspaceJump(state = false, action) {
	switch (action.type) {
		case Actions.CALCULATE_HYPERSPACE_JUMP_ON:
			console.log("caluclating hyperspace jump: ", true);
			return true;
		case Actions.CALCULATE_HYPERSPACE_JUMP_OFF:
			console.log("calculating hyperspace jump: ", false);
			return false;
		default:
			return state;
	}
}
function pathSearchStart(state = false, action) {
	switch (action.type) {
		case Actions.PATH_SEARCH_START_ON:
			console.log("hyperspace path search: ", true);
			return true;
		case Actions.PATH_SEARCH_START_OFF:
			console.log("hyperspace path search: ", false);
			return false;
		default:
			return state;
	}
}
function pathSearchEnd(state = false, action) {
	switch (action.type) {
		case Actions.PATH_SEARCH_END_ON:
			console.log("hyperspace path search: ", true);
			return true;
		case Actions.PATH_SEARCH_END_OFF:
			console.log("hyperspace path search: ", false);
			return false;
		default:
			return state;
	}
}
function pinPointStart(state = false, action) {
	switch (action.type) {
		case Actions.PIN_POINT_START_ON:
			console.log("pinpoint start: ", true);
			return true;
		case Actions.PIN_POINT_START_OFF:
			console.log("pin point end: ", false);
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
			console.log("pinpoint start: ", true);
			return true;
		case Actions.PIN_POINT_END_OFF:
			console.log("pin point end: ", false);
			return false;
		case Actions.PIN_POINT_END_TOGGLE:
			return (state)? false : true;
		default:
			return state;
	}	
}
function hyperspaceStartSystem(state = '', action) {
	switch (action.type) {
		case Actions.SET_START_SYSTEM:
			console.log("setting start system: ", action.payload);
			return action.payload;
		case Actions.SET_START_SYSTEM_ERROR:
			console.log("set start system error: ", action.payload);
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
			console.log("set start system error: ", action.payload);
			return state;
		case Actions.SET_END_SYSTEM_EMPTY:
			return '';
		default:
			return state;
	}	
}
function zoom(state = defaultZoom, action) {
	switch (action.type) {
		case Actions.GET_ZOOM_VALUE:
			console.log("getting zoom value: ", state);
			return state;
		case Actions.SET_ZOOM_VALUE:
			console.log("setting zoom value: ", action.payload);
			return action.payload;
		case Actions.ZOOM_TO_GALAXY:
			return defaultZoom;
		default:
			return state;
	}
}
function zoomChange(state = true, action) {
	switch (action.type) {
		case Actions.ZOOM_CHANGE_ON:
			console.log("Map is zooming: ", true);
			return true;
		case Actions.ZOOM_CHANGE_OFF:
			console.log("Map is zooming: ", false);
			return false;
		case Actions.ZOOM_CHANGE_STATUS:
			console.log("Map zoom status: ", state);
			return state;
		default:
			return state;
	}
}
function renderMap(state = true, action) {
	switch (action.type) {
		case Actions.MAP_RENDER_ON:
			console.log("rendering map: ", true);
			return true;
		case Actions.MAP_RENDER_OFF:
			console.log("rendering map: ", false);
			return false;
		case Actions.MAP_RENDER_STATUS:
			console.log("rendering map status: ", state);
			return state;
		default:
			return state;
	}
}
function updateHyperspaceNavigation(state = false, action) {
	switch (action.type) {
		case Actions.UPDATE_HYPERSPACE_NAVIGATION_ON:
			console.log("update hyperspace navigation: ", true);
			return true;
		case Actions.UPDATE_HYPERSPACE_NAVIGATION_OFF:
			console.log("update hyperspace navigation: ", false);
			return false;
		default:
			return state;
	}
}


export default combineReducers({
	dataStream,
	systemsSearchControlsOn,
	mapControlsOn,
	hyperspaceNavigationControlsOn,
	activeSystem,
	searchSystems,
	zoom,
	renderMap,
	zoomChange,
	hyperspacePathCollections,
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
	hyperspacePathNumber,
	pinPointStart,
	pinPointEnd,
	calculateHyperspaceJump,
	updateHyperspaceNavigation,
	mapCenterAndZoom
});




