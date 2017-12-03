import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { chainMiddleware } from 'redux-chain';
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/reducers.js';

const middleware = [chainMiddleware, thunkMiddleware];
const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
