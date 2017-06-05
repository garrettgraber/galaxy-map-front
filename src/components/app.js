import React from 'react';
import { connect } from 'react-redux';

// import MapBase from './mapBase.js';
import MapMain from './mapMain.js';


// console.log("MapBase:", MapBase);

// console.log("MapMain: ", MapMain);

// require("css-loader!../css/main.css")


// component
class App extends React.Component {
	constructor(props, context) {
	    super(props, context);
	}

	componentDidMount() {

		console.log("App has Mounted: ", this.props);
	}


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

// export default App;