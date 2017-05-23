import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/reducers.js';
import thunk from 'redux-thunk';


// export default storeTest;


console.log("rootReducer: ", rootReducer);

const store = createStore(rootReducer, applyMiddleware(thunk));

console.log("store: ", store);

export default store;



