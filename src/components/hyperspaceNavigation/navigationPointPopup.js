import React from 'react';
import { connect } from 'react-redux';
import { Popup } from 'react-leaflet';
import L from 'leaflet';
import { If, Then, Else } from 'react-if';
import uuidv4 from 'uuid/v4';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class NavigationPointPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const StarObject = this.props.StarObject;
    const starLocation = [ StarObject.lat, StarObject.lng ];
    const xGalactic = (StarObject.xGalactic !== null)? StarObject.xGalactic : 'Unknown';
    const yGalactic = (StarObject.yGalactic !== null)? StarObject.yGalactic : 'Unknown';
    const sector = (StarObject.sector && StarObject.sector[0] !== '')? StarObject.sector[0] : 'Unknown';
    const region = StarObject.region || 'Unknown';

  	return (
      <Popup key={uuidv4()} className="star-system-popup"  minWidth={90} position={starLocation} autoPan={false}>
        <div>
          <span style={{fontWeight: 'bold'}}>{StarObject.system}</span><br/>
          <span>X:&nbsp;&nbsp;{xGalactic.toString()}</span><br/>
          <span>Y:&nbsp;&nbsp;{yGalactic.toString()}</span><br/>
          <span>Grid:&nbsp;&nbsp;{StarObject.coordinates}</span><br/>
          <span>Sector:&nbsp;&nbsp;{sector}</span><br/>
          <span>Region:&nbsp;&nbsp;{StarObject.region}</span><br/>
          <span>
            <If condition={StarObject.link !== null}>
              <Then>
                <a href={StarObject.link} rel="external" target="_blank">Wookieepedia Link</a>
              </Then>
              <Else>
                {() => null}
              </Else>
            </If>
          </span>
        </div>
      </Popup>
  	)
  }
}

export default NavigationPointPopup;