import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { If, Then, Else } from 'react-if';
import _ from 'lodash';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import ApiService from '../../remoteServices/apiService.js';

class HyperspaceLanesData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspaceData: {}
    };
  }

  componentDidMount() {
    ApiService.hyperspaceGeoJsonData().then(Data => {
      this.setState({HyperspaceData: Data});
    }).catch(err => {
      console.log("Error getting hyperspace geo json data: ", err);
    });
  }

  onEachFeature(feature, layer) {
    if(feature.properties.hyperspace) {
      const hyperspaceLaneName = feature.properties.hyperspace;
      const hyperspaceLaneLink = feature.properties.link;
      const hyperspaceLaneDistane = feature.properties.length;
      const laneName = '<span style="font-weight: bold;">' + hyperspaceLaneName + '</span><br/>';
      const laneDistane = '<span>Distance: ' + hyperspaceLaneDistane + '</span></br>';
      const laneLink = '<a href=' + hyperspaceLaneLink + ' rel="external" target="_blank">Wookieepedia Link</a>';
      const hyperspaceLaneString = laneName + laneDistane + laneLink;

      layer.bindPopup(hyperspaceLaneString)
      .on('click', function (e) {
          this.openPopup();
      });
    } else {
      layer.bindPopup("Unamed Hyperspace Lane")
      .on('click', function (e) {
          this.openPopup();
      });
    }
  }

  pointToLayer(feature, latlng) {}

  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
  	const zIndex = 250;
  	return (
      <LayerGroup className="layer-group">
    		<Pane name="hyperspace-pane" style={{ zIndex: zIndex }}>
          <If condition={ !_.isEmpty(this.state.HyperspaceData)}>
            <Then>
              <GeoJSON
                data={this.state.HyperspaceData}
                style={hyperspaceLanesStyleCarolina}
                ref='hyperspace'
                onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}
                pointToLayer={(feature, latlng) => this.pointToLayer(feature, latlng)}
              />
            </Then>
            <Else>{() => null }</Else>
          </If>
    		</Pane>
      </LayerGroup>
  	)
  }
}

export default HyperspaceLanesData;