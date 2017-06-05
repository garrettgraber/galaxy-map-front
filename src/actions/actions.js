import 'whatwg-fetch';
import urlencode from 'urlencode';
import { zoomToSystem, zoomToSystemError, searchSystemsStart, searchSystemsFinish } from './actionCreators.js';

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
	    dispatch(searchSystemsStart());

	    // now that the Store has been notified of the new todo item, we 
	    // should also notify our server - we'll use here ES6 fetch 
	    // function to post the data
	    fetch('api/search/?system=' + urlencode(systemName)).then(response => {

	    	return response.json();

	    }).then(json => {

	    	// console.log("json: ", json);
	      // you should probably get a real id for your new todo item here, 
	      // and update your store, but we'll leave that to you
          	let SystemObject = JSON.parse(json);
          	SystemObject = SystemObject[0];

          	console.log("SystemObject: ", SystemObject);

	      	if(SystemObject.hasLocation) {

				const LngLat = SystemObject.LngLat;

				const SystemData = {
					lat: LngLat[1],
					lng: LngLat[0],
					zoom: 6,
					system: SystemObject.system
				};

				console.log("SystemData: ", SystemData);

				dispatch(zoomToSystem(SystemData));

	      	}


	    }).catch(err => {
	    // Error: handle it the way you like, undoing the optimistic update,
	    //  showing a "out of sync" message, etc.

	    	dispatch(zoomToSystemError(err));
	    	dispatch(searchSystemsFinish());
	    });
	  // what you return here gets returned by the dispatch function that 
	  // used this action creator
  		return null; 
  	}
}