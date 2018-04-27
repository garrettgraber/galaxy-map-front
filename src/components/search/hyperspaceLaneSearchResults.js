import React from 'react';
import { connect } from 'react-redux';
import {
  Popup,
  Polyline
} from 'react-leaflet';
import L from 'leaflet';
import { If, Then, Else } from 'react-if';

import { 
    newSearchObjectBoundaries
} from '../../actions/actionCreators.js';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';

class HyperspaceLaneSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const fullRouteElement = this.refs.fullRoute.leafletElement;
    if(fullRouteElement) {
      const map = this.props.map;
      this.props.dispatch(newSearchObjectBoundaries(fullRouteElement.getBounds()));
    }
  }

  componentWillReceiveProps(newProps) {
    const fullRouteElement = this.refs.fullRoute.leafletElement;
    const searchDataChange = this.props.hyperspaceRouteSearchData.name !== newProps.hyperspaceRouteSearchData.name;
    if(fullRouteElement && searchDataChange) {
      const polyline = L.polyline(newProps.hyperspaceRouteSearchData.coordinates);
      const polylineBounds = polyline.getBounds();
      this.props.dispatch(newSearchObjectBoundaries(polylineBounds));
    }
  }

  render() {
   const LaneOptions = {
      opacity: 1.0,
      interactive: true,
      weight: 10
    };

  	return (
      <Polyline
        className="pulse-sector"
        positions={this.props.hyperspaceRouteSearchData.coordinates}
        options={LaneOptions}
        color="#FF8300"
        ref="fullRoute"
      >
        <Popup className="hyperspace-route-popup" ref="popup" minWidth={90} autoPan={false}>
          <div>
            <span style={{fontWeight: 'bold'}}>{this.props.hyperspaceRouteSearchData.name}</span><br/>
            <span style={{color: 'red'}}>Distance:&nbsp;{this.props.hyperspaceRouteSearchData.length.toLocaleString()}&nbsp;parsecs</span><br/>

            <If condition={this.props.hyperspaceRouteSearchData.link === 'No Link'}>
              <Then>
                <span>No Link</span>
              </Then>
              <Else>
                <a href={this.props.hyperspaceRouteSearchData.link} rel="external" target="_blank">Wookieepedia Link</a>
              </Else>
            </If>              
          </div>
        </Popup>
      </Polyline>
  	)
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceLaneSearchResults);