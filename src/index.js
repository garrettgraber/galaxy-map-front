import { AppContainer } from 'react-hot-loader';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import ReactFauxDOM from 'react-faux-dom';
import { Provider, connect } from 'react-redux';

import App from './components/app.js';

import store from './stores/store.js';


// console.log("Provider: ", Provider);
// console.log("App: ", App);



// function counter(state = 0, action) {
//   switch (action.type) {
//   case 'INCREMENT':
//     return state + 1
//   case 'DECREMENT':
//     return state - 1
//   default:
//     return state
//   }
// }



// store.subscribe(() => {
//   console.log("Application state: ", store.getState());
// });

// console.log("store: ", store);


ReactDOM.render(
	<AppContainer>
		<Provider store={store}>
		    <App />
		</Provider>
	</AppContainer>,
    document.getElementById('container')
);

if (module.hot) {
	// Enable Webpack hot module replacement for Component
	module.hot.accept('./components/app.js', () => {
		render(App);
	});
}


// ReactDOM.render(<App />, document.getElementById('main'));

// ReactDOM.render(<App />, document.getElementById('container'));


