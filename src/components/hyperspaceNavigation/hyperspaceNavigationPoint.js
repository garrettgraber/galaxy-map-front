import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import { If, Then, Else } from 'react-if';
import L from 'leaflet';
import width from 'text-width';
import uuidv4 from 'uuid/v4';

import NavigationPointPopup from './navigationPointPopup.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class HyperspaceNavigationPoint extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pointColor = 'red';
    const HyperspacePointCurrent = this.props.HyperSpacePoint;
    const hyperspacePointLocation = [HyperspacePointCurrent.lat, HyperspacePointCurrent.lng];
    const LocationStartColorGreen = '#49fb35';
    const LocationEndColorRed = '#ff0101';
    const LocationColor = (this.props.isStart)? LocationStartColorGreen : LocationEndColorRed;
    const currentSystem = HyperspacePointCurrent.system;
    const myIcon = textIconGenerator(currentSystem);

  	return (
      <div key={HyperspacePointCurrent.system + ":" + uuidv4()}>
        <CircleMarker key={uuidv4()}  className="expand-ring-pulse-counter" center={hyperspacePointLocation} radius={6} color={LocationColor} weight={2} >
          <NavigationPointPopup StarObject={HyperspacePointCurrent} />
        </CircleMarker>
        <CircleMarker key={uuidv4()}  className="expand-ring-pulse" center={hyperspacePointLocation} radius={10} color={LocationColor} weight={2}>
          <NavigationPointPopup StarObject={HyperspacePointCurrent} />
        </CircleMarker>
        <CircleMarker  key={uuidv4()} center={hyperspacePointLocation} radius={1} color={pointColor}>
          <NavigationPointPopup StarObject={HyperspacePointCurrent} />
        </CircleMarker>
        <Marker key={uuidv4()} position={hyperspacePointLocation}  icon={myIcon} zIndexOffset={5}>
          <NavigationPointPopup StarObject={HyperspacePointCurrent} />
        </Marker>
      </div>                  
  	)
  }
}

function textIconGenerator(systemName) {
  const textWidth = width(systemName, {size: "1em"});
  let textPadding = 0;
  if(textWidth >= 75) {
    textPadding = 30;
  } else if(textWidth < 75 && textWidth > 40) {
    textPadding = 20;
  } else {
    textPadding = 10;
  }

  return L.divIcon({
    className: "hyperspaceNodeLabel",
    iconSize: new L.Point(textWidth + textPadding, 24),
    iconAnchor: new L.Point(textWidth / 2.0, 18),
    html: systemName
  });
}

export default HyperspaceNavigationPoint;