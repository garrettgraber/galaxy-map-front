import React from 'react';
import { connect } from 'react-redux';
import '../../css/main.css';


import { 
    toggleSystemsSearchControls,
    toggleMapControls,
    toggleHyperspaceNavigationControls,
    addItemToDataStream
} from '../../actions/actionCreators.js';

class SideBar extends React.Component {
  constructor() {
    super();
  }
  searchSystemsToggle(e) {
    this.props.dispatch( toggleSystemsSearchControls() );
  }
  mapControlsToggle(e) {
    this.props.dispatch( toggleMapControls() );
  }
  hyperspaceNavigationControls(e) {
    this.props.dispatch( toggleHyperspaceNavigationControls() );
  }
	render() {
    const SideBarStyles = {
      position: 'fixed',
      top: 50,
      height: 500,
      width: 60,
      zIndex: 30,
      backgroundColor: 'black',
      border: '1px solid #49fb35'
    };
    const searchSystemsClasses = (this.props.systemsSearchControlsOn)? "btn btn-success control-button" : "btn btn-danger control-button";
    const mapClasses = (this.props.mapControlsOn)? "btn btn-success control-button" : "btn btn-danger control-button";
    const hyperspaceNavigationClasses = (this.props.hyperspaceNavigationControlsOn)? "btn btn-success control-button" : "btn btn-danger control-button";
    return (
      <div id="side-bar" style={SideBarStyles}>
        <button id="map-controls-toggle" type="button" className={mapClasses}  onClick={e => this.mapControlsToggle(e)} ><i className="glyphicon glyphicon-map-marker"></i></button>
        <button id="search-systems-toggle" type="button" className={searchSystemsClasses}  onClick={e => this.searchSystemsToggle(e)} ><i className="glyphicon glyphicon-globe"></i></button>
        <button id="hyperspace-navigation-controls-toggle" type="button" className={hyperspaceNavigationClasses}  onClick={e => this.hyperspaceNavigationControls(e)} ><i className="fa fa-rocket"></i></button>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(SideBar);