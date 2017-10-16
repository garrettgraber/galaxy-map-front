import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { chainMiddleware } from 'redux-chain';
// import thunk from 'redux-thunk';
import thunkMiddleware from 'redux-thunk'


import rootReducer from '../reducers/reducers.js';

// export default storeTest;


console.log("rootReducer: ", rootReducer);

const middleware = [chainMiddleware, thunkMiddleware];

const store = createStore(rootReducer, applyMiddleware(...middleware));

console.log("store: ", store);

export default store;



