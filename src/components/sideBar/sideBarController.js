import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';

import SearchData from './searchData/searchData.js';
import HyperspacePathSearch from './hyperspaceNavigationControls/hyperspacePathSearch.js';
import '../../css/main.css';

class SideBarController extends React.Component {
  constructor() {
    super();
  }
	render() {

    const ControlContainerStyles = {
      position: 'fixed',
      top: 70,
      left: 70,
      height: 'auto',
      zIndex: 10
    };

    const ControlContainerStylesMobile = {
      position: 'fixed',
      top: 70,
      left: 0,
      height: 'auto',
      zIndex: 10,
      width: '100%',
      padding: 4
    };

    const ActiveControlContainerStyles = (this.props.mobileStatus)? ControlContainerStylesMobile : ControlContainerStyles;

    return (
      <div id="control-container" style={ActiveControlContainerStyles}>
        <If condition={ this.props.systemsSearchControlsOn }>
            <Then>
              <SearchData map={this.props.map}/>
            </Then>
            <Else>{() => null }</Else>
        </If>
        <If condition={ this.props.hyperspaceNavigationControlsOn }>
            <Then>
              <HyperspacePathSearch map={this.props.map}/>
            </Then>
            <Else>{() => null }</Else>
        </If>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(SideBarController);