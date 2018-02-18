import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import '../../css/main.css';

import { 
    toggleSystemsSearchControls,
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
  hyperspaceNavigationControls(e) {
    this.props.dispatch( toggleHyperspaceNavigationControls() );
  }
	render() {
    const SideBarStyles = {
      position: 'fixed',
      top: 50,
      height: 120,
      width: 60,
      zIndex: 30,
      backgroundColor: 'black',
      border: '1px solid #49fb35',
      borderRadius: 4
    };
    const searchSystemsClasses = (this.props.systemsSearchControlsOn)? "btn btn-success control-button" : "btn btn-danger control-button";
    const hyperspaceNavigationClasses = (this.props.hyperspaceNavigationControlsOn)? "btn btn-success control-button" : "btn btn-danger control-button";
    return (
      <div id="side-bar" style={SideBarStyles}>
        <button
          id="search-systems-toggle"
          type="button" 
          className={searchSystemsClasses}
          onClick={e => this.searchSystemsToggle(e)}
          data-tip="Systems Search"
          data-for="systems-search-toggle"
        >
          <ReactTooltip id='systems-search-toggle'>{}</ReactTooltip>
          <i className="glyphicon glyphicon-globe"></i>
        </button>
        <button
          id="hyperspace-navigation-controls-toggle"
          type="button"
          className={hyperspaceNavigationClasses}
          onClick={e => this.hyperspaceNavigationControls(e)}
          data-tip="Hyperspace Navigation Computer"
          data-for="hyperspace-navigation-computer-toggle"
        >
          <ReactTooltip id='hyperspace-navigation-computer-toggle'>{}</ReactTooltip>
          <i className="fa fa-rocket"></i>
        </button>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(SideBar);