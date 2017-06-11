import React from 'react';
import { connect } from 'react-redux';
import SearchData from './searchData.js';

import '../css/main.css';

import { setZoomValue, zoomToSystem, getZoomValue } from '../actions/actionCreators.js';


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
        console.log("store zoom: ", this.props.dispatch(getZoomValue()));
        this.props.dispatch(setZoomValue(2));

        // this.props.dispatch(findSystem('Coruscant'));


    }



    handleUpPanClick() {
        const map = this.props.map;
        map.panBy([0, -100]);
        console.log('Panning up');
    }
    handleRightPanClick() {
        const map = this.props.map;
        map.panBy([100, 0]);
        console.log('Panning right');
    }
    handleLeftPanClick() {
        const map = this.props.map;
        map.panBy([-100, 0]);
        console.log('Panning left');
    }
    handleDownPanClick() {
        const map = this.props.map;
        map.panBy([0, 100]);
        console.log('Panning down');
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

                    <button className="btn btn-primary navbar-button" onClick={e => this.handleLeftPanClick(e)} >
                        Left
                    </button>


                    <button className="btn btn-primary navbar-button" onClick={e => this.handleRightPanClick(e)} >
                        Right
                    </button>


                    <button className="btn btn-primary navbar-button" onClick={e => this.handleUpPanClick(e)} >
                        Up
                    </button>


                    <button className="btn btn-primary navbar-button" onClick={e => this.handleDownPanClick(e)} >
                        Down
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

