import React from 'react';
import { connect } from 'react-redux';
import SearchData from './searchData.js';

import '../css/main.css';

import { setZoomValue, zoomToSystem } from '../actions/actionCreators.js';


import { findSystem } from '../actions/actions.js';



class NavBar extends React.Component {


    componentDidMount() {

        console.log("NavBar has mounted: ", this.props);
        
    }

    goHome() {

        console.log("goHome has fired: ", this.props);
        this.props.currentSystem.lat = 0.0;
        this.props.currentSystem.lng = 0.0;
        this.props.currentSystem.system = "Coruscant";
        this.props.dispatch(setZoomValue(2));

        // this.props.dispatch(findSystem('Coruscant'));


    }

    // dispatch

	render() {



        console.log("NavBar props: ", this.props);


    	return (
            <div id="nav-container">
            	<div className="nav-section">
                    <SearchData/>
                    <button id="home-button-icon" type="button" className="btn btn-primary navbar-button"  onClick={e => this.goHome(e)} ><i className="glyphicon glyphicon-home"></i></button>
                    <button  className="btn btn-primary navbar-button" onClick={e => this.goHome(e)} >
                        Home
                    </button>
                    
                </div>
            </div>

        );
    }
}



const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default NavBar;

export default connect(mapStateToProps)(NavBar);

