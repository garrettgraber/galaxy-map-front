import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { If, Then, Else } from 'react-if';

import '../../css/main.css';

import {
  setMapToZeroZeroZoomOne,
  loadingIconOff
} from '../../actions/actionCreators.js';

import MapNavigationCircle from './mapNavigationCircle.js';
import * as MapCircleStyles from './mapCircleStyles.js';
import GalaxyIconOnEdge from '../../images/icons/randomly-found/galaxy.png';


class MapNavigationControl extends React.Component {
  constructor() {
    super();

    this.state = {
      mapControlsOn: true
    }
  }
  componentDidMount() { }

  mapControlsToggle(e) {
    this.refs.mapOpenToggle.blur();
    const mapControlsOn = this.state.mapControlsOn;
    this.setState({mapControlsOn: !mapControlsOn});
  }

  goHome() {
    this.refs.galaxyHomeButtonMobile.blur();
    if(this.props.mobileStatus) {
      this.props.dispatch(setMapToZeroZeroZoomOne());
      this.props.dispatch(loadingIconOff());
    }
  }
  
	render() {
    const bottomBase = 40;
    const mapControlsButtonPositionRight = (this.state.mapControlsOn)? 170 : 0;
    const mapControlsButtonClasses = (this.state.mapControlsOn)? "btn btn-success" : "btn btn-danger";
    const mapControlsButtonMessage = (this.state.mapControlsOn)? "Close Map Tools" : "Open Map Tools";

    return (
      <div>
        <If condition={ this.props.mobileStatus }>
          <Then>
            <If condition={ this.props.selectFocused }>
              <Then>{() => null }</Then>
              <Else>
                <button
                  style={MapCircleStyles.GalaxyHomeButtonMobileStyle}
                  onClick={e => this.goHome(e)}
                  ref="galaxyHomeButtonMobile"
                >
                  <img id="galaxy-view-home-mobile" style={MapCircleStyles.GalaxyImageStyle} src={GalaxyIconOnEdge}/>
                </button>
              </Else>
            </If>
          </Then>
          <Else>
            <div>
              <div style={{position: "fixed", bottom: bottomBase + 65, right: mapControlsButtonPositionRight, width: 40, height: 40, zIndex: 12}}>
                <button
                  type="button"
                  className={mapControlsButtonClasses}
                  onClick={(e) => this.mapControlsToggle(e)}
                  data-tip={mapControlsButtonMessage}
                  data-for="close-map-tools-toggle-navigation"
                  style={{width: 40, height: 40, borderRadius: 20}}
                  ref="mapOpenToggle"
                >
                  <i className="fa fa-map-marker"></i>
                </button>
                <ReactTooltip id='close-map-tools-toggle-navigation' place="top">{}</ReactTooltip>
              </div>
              <If condition={ this.state.mapControlsOn }>
                  <Then>
                    <MapNavigationCircle bottomBase={bottomBase} map={this.props.map} />
                  </Then>
                  <Else>{() => null }</Else>
              </If>
            </div>
          </Else>
        </If>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(MapNavigationControl);