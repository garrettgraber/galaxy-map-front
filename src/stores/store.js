import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import rootReducer from '../reducers/reducers.js';
import thunk from 'redux-thunk';


// export default storeTest;


console.log("rootReducer: ", rootReducer);

const store = createStore(enableBatching(rootReducer), applyMiddleware(thunk));

console.log("store: ", store);

export default store;



