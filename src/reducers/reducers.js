import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import multi from 'redux-multi';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// import * as Actions from '../constants/actionTypes.js';

import Actions from '../constants/actionTypesModule.js';

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
const emptyMapHash = null;
const nullHyperspaceHash = null;


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
function mapControlsOn(state = true, action) {
	switch (action.type) {
		case Actions.MAP_CONTROLS_ON:
			return true;
		case Actions.MAP_CONTROLS_OFF:
			return false;
		case Actions.MAP_CONTROLS_TOGGLE:
			let newState = (state)? false : true;
			return newState;
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
function activeSystem(state = CoruscantSystem, action) {
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
			console.log("set map zoom and center: ", StateClone);
			return StateClone;
		case Actions.INCREASE_MAP_ZOOM_BY_ONE:
			StateClone.zoom += 1;
			return StateClone;
		case Actions.DECREASE_MAP_ZOOM_BY_ONE:
			StateClone.zoom -= 1;
			return StateClone;
		case Actions.SET_MAP_CENTER_AND_ZOOM_TO_DEFAULT:
			return CoruscantLocation;
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
function hyperspaceActiveStartNode(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_ACTVIE_START_NODE:
			return action.payload;
		case Actions.SET_ACTVIE_START_NODE_DEFAULT:
			return BlankPoint;
		default:
			return state;
	}
}
function hyperspaceActiveEndNode(state = BlankPoint, action) {
	switch (action.type) {
		case Actions.SET_ACTVIE_END_NODE:
			return action.payload;
		case Actions.SET_ACTVIE_END_NODE_DEFAULT:
			return BlankPoint;
		default:
			return state;
	}
}
function hyperspacePointZoomOn(state = false, action) {
	switch (action.type) {
		case Actions.HYPERSPACE_POINT_ZOOM_ON:
			console.log("point zoom: ", true);
			return true;
		case Actions.HYPERSPACE_POINT_ZOOM_OFF:
			console.log("point zoom: ", false);
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

export default combineReducers({
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
	mapControlsOn,
	hyperspaceNavigationControlsOn,
	activeSystem,
	searchSystems,
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
	pinPointStart,
	pinPointEnd,
	calculateHyperspaceJump,
	updateHyperspaceNavigation,
	mapCenterAndZoom
});