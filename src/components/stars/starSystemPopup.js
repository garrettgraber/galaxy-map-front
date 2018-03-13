import React from 'react';
import { connect } from 'react-redux';
import { Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class StarSystemPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const StarObject = this.props.StarObject;
    const starLocation = [ StarObject.lat, StarObject.lng ];
    const sector = StarObject.sector[0] || 'Unknown';

  	return (
      <Popup className="star-system-popup"  minWidth={90} position={starLocation} autoPan={false}>
        <div>
          <span style={{fontWeight: 'bold'}}>{StarObject.system}</span><br/>
          <span>X:&nbsp;&nbsp;{StarObject.xGalactic.toString()}</span><br/>
          <span>Y:&nbsp;&nbsp;{StarObject.yGalactic.toString()}</span><br/>
          <span>Grid:&nbsp;&nbsp;{StarObject.coordinates}</span><br/>
          <span>Sector:&nbsp;&nbsp;{sector}</span><br/>
          <span>Region:&nbsp;&nbsp;{StarObject.region}</span><br/>
          <span>
            <a href={StarObject.link} rel="external" target="_blank">Wookieepedia Link</a>
          </span>
        </div>
      </Popup>
  	)
  }
}

export default StarSystemPopup;