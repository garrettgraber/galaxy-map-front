import { createStore, combineReducers } from 'redux';
import { counter, currentSystem } from '../reducers/reducers.js';


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




// export default storeTest;


const rootReducer = combineReducers({currentSystem});

console.log("rootReducer: ", rootReducer);

const store = createStore(rootReducer);

console.log("store: ", store);

export default store;



