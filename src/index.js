import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app.js';
import store from './stores/store.js';

ReactDOM.render(
	<AppContainer>
		<Provider store={store}>
	    <App />
		</Provider>
	</AppContainer>,
	document.getElementById('mount-container')
);

// Enable Webpack hot module replacement for Component
if (module.hot) {
	module.hot.accept('./components/app.js', () => {
		render(App);
	});
}