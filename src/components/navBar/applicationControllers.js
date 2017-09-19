import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';

import SearchData from './searchData.js';
import MapControls from './mapControls.js';
import HyperspacePathSearch from './hyperspacePathSearch.js';
import '../../css/main.css';

class ApplicationControllers extends React.Component {
  componentDidMount() { 
    console.log("ApplicationControllers has Mounted");
  }
  
	render() {
    return (
      <div id="control-container">
        <If condition={ this.props.mapControlsOn }>
            <Then>
              <MapControls map={this.props.map} />
            </Then>
            <Else>{() => null }</Else>
        </If>
        <If condition={ this.props.systemsSearchControlsOn }>
            <Then>
              <SearchData/>
            </Then>
            <Else>{() => null }</Else>
        </If>
        <If condition={ this.props.hyperspaceNavigationControlsOn }>
            <Then>
              <HyperspacePathSearch/>
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

export default connect(mapStateToProps)(ApplicationControllers);