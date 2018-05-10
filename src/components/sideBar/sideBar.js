import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { If, Then, Else } from 'react-if';

import '../../css/main.css';

import { 
    toggleSystemsSearchControls,
    toggleHyperspaceNavigationControls,
    pathStartClickOff,
    pathEndClickOff,
    pinPointStartOff,
    pinPointEndOff,
    defaultCursor,
    deActivateSystemsSearchControls,
    deActivateHyperspaceNavigationControls
} from '../../actions/actionCreators.js';

class SideBar extends React.Component {
  constructor() {
    super();
  }
  searchSystemsToggle(e) {
    this.refs.searchSystems.blur();

    if(this.props.mobileStatus && this.props.hyperspaceNavigationControlsOn && !this.props.systemsSearchControlsOn) {
      this.props.dispatch(deActivateHyperspaceNavigationControls());
    }

    this.props.dispatch(toggleSystemsSearchControls());

  }
  hyperspaceNavigationControls(e) {
    this.refs.navigationControls.blur();


    if(this.props.mobileStatus && this.props.systemsSearchControlsOn && !this.props.hyperspaceNavigationControlsOn) {
      this.props.dispatch(deActivateSystemsSearchControls());
    }


    if(this.props.hyperspaceNavigationControlsOn) {
      this.props.dispatch(defaultCursor());
      this.props.dispatch(pathStartClickOff());
      this.props.dispatch(pathEndClickOff());
      this.props.dispatch(pinPointEndOff());
      this.props.dispatch(pinPointStartOff());
    }
    this.props.dispatch( toggleHyperspaceNavigationControls() );
  }
	render() {
    const SideBarStyles = {
      position: 'fixed',
      top: 70,
      height: 120,
      width: 60,
      zIndex: 30,
      backgroundColor: 'black',
      border: '1px solid #49fb35',
      borderRadius: 4
    };
    const SideBarStylesMobile = {
      position: 'fixed',
      top: 0,
      height: 60,
      width: 120,
      zIndex: 30,
      backgroundColor: 'black',
      border: '1px solid #49fb35',
      borderRadius: 4
    };

    const ActiveSideBarStyle = (this.props.mobileStatus)? SideBarStylesMobile : SideBarStyles;

    const searchSystemsClasses = (this.props.systemsSearchControlsOn)? "btn btn-success control-button" : "btn btn-danger control-button";
    const hyperspaceNavigationClasses = (this.props.hyperspaceNavigationControlsOn)? "btn btn-success control-button" : "btn btn-danger control-button";
    return (
      <div id="side-bar" style={ActiveSideBarStyle}>
        <button
          id="search-systems-toggle"
          type="button" 
          className={searchSystemsClasses}
          onClick={e => this.searchSystemsToggle(e)}
          data-tip="Search"
          data-for="systems-search-toggle"
          ref="searchSystems"
        >
          <If condition={ this.props.mobileStatus }>
            <Then>{() => null}</Then>
            <Else>
              <ReactTooltip id='systems-search-toggle'>{}</ReactTooltip>
            </Else>
          </If>
          <i className="glyphicon glyphicon-search"></i>
        </button>
        <button
          id="hyperspace-navigation-controls-toggle"
          type="button"
          className={hyperspaceNavigationClasses}
          onClick={e => this.hyperspaceNavigationControls(e)}
          data-tip="Hyperspace Navigation Computer"
          data-for="hyperspace-navigation-computer-toggle"
          ref="navigationControls"
        >
          <If condition={ this.props.mobileStatus }>
            <Then>{() => null}</Then>
            <Else>
              <ReactTooltip id='hyperspace-navigation-computer-toggle'>{}</ReactTooltip>
            </Else>
          </If>
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