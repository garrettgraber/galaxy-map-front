
import { createStore, combineReducers } from 'redux';
import * as Actions from '../constants/actionTypes.js';


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
})

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
storeTest.dispatch({ type: 'INCREMENT' })
// 1
storeTest.dispatch({ type: 'INCREMENT' })
// 2
storeTest.dispatch({ type: 'DECREMENT' })
// 1
console.log( (storeTest.getState() === 1)? "redux on" : "redux off" );




const StartPosition = {
	lat: 0,
	lng: 0,
	zoom: 2
};



function currentSystem(state = StartPosition, action) {

	switch (action.type) {
		case Actions.ZOOM_TO_SYSTEM:
			console.log("zoom to system state: ", action.payload);
			return action.payload;
		case Actions.ZOOM_TO_SYSTEM_ERROR:
			console.log("zoom to system error: ", action.payload);
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


function zoom(state = 2, action) {

	switch (action.type) {
		case Actions.GET_ZOOM_VALUE:
			console.log("getting zoom value: ", state);
			return state;
		case Actions.SET_ZOOM_VALUE:
			console.log("setting zoom value: ", action.payload);
			return action.payload;
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




// const rootReducer = combineReducers({currentSystem, searchSystems});

export default combineReducers({currentSystem, searchSystems, zoom, renderMap, zoomChange});




