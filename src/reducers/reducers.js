


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

const StartPosition = {
	lat: 0,
	lng: 0,
	zoom: 2
};



export function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}


export function currentSystem(state = StartPosition, action) {

	switch (action.type) {
		case 'ZOOM_TO_SYSTEM':
			console.log("zoom to system state: ", action);
			return action.payload;
		default:
			return state;
	}

}
