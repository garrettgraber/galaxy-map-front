import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';

import SearchData from './searchData/searchData.js';
import MapControls from './mapControls.js';
import HyperspacePathSearch from './hyperspaceNavigationControls/hyperspacePathSearch.js';
import '../../css/main.css';

class SideBarController extends React.Component {
  constructor() {
    super();
  }
	render() {
    return (
      <div id="control-container">
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