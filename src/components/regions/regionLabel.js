import React from 'react';
import {
  Marker,
  Popup
} from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';



const RegionsDictionary = {
  'Core': 'Core_Worlds',
  'Colonies': 'Colonies',
  'Inner Rim': 'Inner_Rim',
  'Expansion Region': 'Expansion_Region',
  'Mid RIm': 'Mid_Rim',
  'Hutt Space': 'Hutt_Space',
  'Outer Rim': 'Outer_Rim_Territories',
  'Wild Space': 'Wild_Space',
  'Deep Core': 'Deep_Core',
  'Unknown Regions': 'Unknown_Regions'
};

function createWookiepediaLink(region) {
  const wookiepediaBaseUrl = 'https://starwars.fandom.com/wiki/';
  console.log('region: ', region);
  return `${wookiepediaBaseUrl}${RegionsDictionary[region]}`;
}


class RegionLabel extends React.Component {
  constructor(props) {
    super(props);

    const wookiepediaLink = createWookiepediaLink(props.name);

    this.state = {
      name: props.name,
      position: props.position,
      icon: props.icon,
      link: wookiepediaLink
    };
  }

  render() {
    return (
      <Marker
        key={this.state.name}
        position={this.state.position}
        icon={this.state.icon}
      >
        <Popup
          className="region-popup"
          minWidth={90}
          // position={this.state.position}
          autoPan={false}
        >
          <div>
            <span style={{fontWeight: 'bold'}}>{this.state.name}</span><br/>
            <span>
              <a href={this.state.link} rel="external" target="_blank">Wookieepedia Link</a>
            </span>
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default RegionLabel;