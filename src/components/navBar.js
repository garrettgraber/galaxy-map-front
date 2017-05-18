import React from 'react';
import { connect } from 'react-redux';
import SearchData from './searchData.js';

import '../css/main.css';


class NavBar extends React.Component {

	render() {

    	return (
            <div id="nav-container">
            	<div className="nav-section">
                    <SearchData/>
                </div>
            </div>

        );
    }
}



const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


export default NavBar;

// export default connect(mapStateToProps)(NavBar);

