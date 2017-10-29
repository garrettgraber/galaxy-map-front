import React from 'react';
import { connect } from 'react-redux';
import MapMain from './mapMain.js';

class App extends React.Component {
	constructor(props, context) {
	    super(props, context);
	}

	componentDidMount() { }

	render() {
		return (
			<div>
				<MapMain />
			</div>
        );
    }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(App);