import React from 'react';
import { connect } from 'react-redux';
import '../../css/main.css';


import { 
    toggleSystemsSearchControls,
    toggleMapControls,
    toggleHyperspaceNavigationControls,
    addItemToDataStream
} from '../../actions/actionCreators.js';

class NavigationBar extends React.Component {  
  componentDidMount() {
    console.log("NavigationBar has Mounted");
  }

  searchSystemsToggle(e) {
    console.log("Search Systems Now Active: ",  this.props);
    this.props.dispatch( toggleSystemsSearchControls() );
  }

  mapControlsToggle(e) {
    console.log("Map Controls Now Active");
    this.props.dispatch( toggleMapControls() );
  }

  hyperspaceNavigationControls(e) {
    console.log("Hyperspace Navigation Now Active");
    this.props.dispatch( toggleHyperspaceNavigationControls() );
  }

	render() {

    const NavigationStyles = {
      position: 'fixed',
      top: 80,
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
      <div id="navigation-bar" style={NavigationStyles}>
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

export default connect(mapStateToProps)(NavigationBar);