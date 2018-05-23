import React from 'react';
import { connect } from 'react-redux';
import {
  CircleMarker,
  Marker,
  LayerGroup,
  Pane,
  FeatureGroup
} from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import uuidv4 from 'uuid/v4';
import { If, Then, Else } from 'react-if';

import StarSystemPopup from '../stars/starSystemPopup.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';

class SystemsSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) { }

  render() {
    const systemsSearchLat = this.props.activeSystem.lat;
    const systemsSearchLng = this.props.activeSystem.lng;
    const systemsSearchColor = 'white';
    const starColor = 'red';
    const fillColor = '#f03';
    const fillOpacity = 0.5;
    const starLocation = [systemsSearchLat, systemsSearchLng];
    const myIcon = textIconGenerator(this.props.activeSystem.system);
    const zIndex = 275;

  	return (
      <LayerGroup>
        <Pane name="system-search-pane" style={{ zIndex: zIndex }}>
          <FeatureGroup>
             <If condition={this.props.activeSystem.lat !== null && this.props.activeSystem.lng !== null}>
              <Then>
                <div>
                  <CircleMarker key={uuidv4()}  className="expand-ring-pulse-counter" center={starLocation} radius={6} color={systemsSearchColor} weight={2} >
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </CircleMarker>
                  <CircleMarker key={uuidv4()}  className="expand-ring-pulse" center={starLocation} radius={10} color={systemsSearchColor} weight={2}>
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </CircleMarker>
                  <CircleMarker  key={uuidv4()}  center={starLocation} radius={1} color={starColor} fillColor={fillColor} fillOpacity={fillOpacity} >
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </CircleMarker>
                  <Marker key={this.props.activeSystem.system} position={starLocation} zIndexOffset={-5} icon={myIcon}>
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </Marker>
                </div>
              </Then>
              <Else>
                {() => null}
              </Else>
            </If>
          </FeatureGroup>
        </Pane>
      </LayerGroup>
  	)
  }
}


function textIconGenerator(systemName) {
  const textWidth = width(systemName, {size: "1em"});
  let textPadding = 0;

  if(textWidth >= 75) {
    textPadding = 30;
  } else if(textWidth < 75 && textWidth > 58) {
    textPadding = 25;
  } else if(textWidth <= 58 && textWidth > 40) {
    textPadding = 20;
  } else if(textWidth <= 40 && textWidth > 20) {
    textPadding = 15;
  } else {
    textPadding = 10;
  }

  return L.divIcon({
    className: "systemSearchLabel",
    iconSize: new L.Point(textWidth + textPadding, 24),
    iconAnchor: new L.Point(textWidth / 2.0, 18),
    html: systemName
  });
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SystemsSearchResults);