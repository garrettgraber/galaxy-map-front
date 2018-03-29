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

import RegionLabels from './regionsLabels.js';
import ApiService from '../../remoteServices/apiService.js';

const RegionsDictionary = {
  "Deep Core": [{
    lat: -18.979025953255267,
    lng: 7.0
  }],
  "Core": [{
    lat: -37.99616267972813,
    lng: 0
  }],
  "Colonies": [{
    lat: -44.96479793033102,
    lng: 3.0
  }],
  "Inner Rim": [{
    lat: -53.4357192066942,
    lng: 0
  }],
  "Expansion Region": [{
    lat: -62.02152819100765,
    lng: 17
  }],
  "Mid RIm": [{
    lat: -69.65708627301174,
    lng: 0
  }],
  "Outer Rim": [{
    lat: -77.76758238272801,
    lng: 0
  }],
  "Wild Space": [{
    lat: -83.13212300319354,
    lng: 0
  }],
  "Unknown Regions": [{
    lat: -10.487811882056683,
    lng: -68.51562500000001
  }],
  "Hutt Space": [{
    lat: -25.16517336866393,
    lng: 110.35937500000001
  }]
};


class Regions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regionsReady: false,
      regionsLabelArray: [],
      RegionData: {}
    }
  }

  componentDidMount() {
    ApiService.regionGeoJsonData().then(jsonResponse => {
      const Data = JSON.parse(jsonResponse);
      this.setState({RegionData: Data});
    }).catch(err => {
      console.log("Error getting regions geo json data: ", err);
    });


  }

  pointToLayer() {}

  onEachFeature(feature, layer) {
    const currentRegionValue = feature.properties.region;
    const currentRegionLabel = RegionsDictionary[currentRegionValue][0];
    let regionInArray = this.state.regionsLabelArray.filter(e => (e.region == currentRegionValue));
    if (regionInArray.length == 0) {
      this.state.regionsLabelArray.push({
        region: currentRegionValue,
        lat: currentRegionLabel.lat,
        lng: currentRegionLabel.lng
      });
    }
    if(this.state.regionsLabelArray.length >= 10) {
      this.setState({regionsReady: true});
    }
  }

  regionClick(e) { }

  render() {
  	const zIndex = 230;
  	const regionsStyle = {color: 'purple', weight: 2, fill: false};

  	return (
      <LayerGroup className="layer-group">
    		<Pane name="regions-pane" style={{ zIndex: zIndex }}>
    			


          <If condition={ !_.isEmpty(this.state.RegionData)}>
            <Then>
              <div>
                <GeoJSON
                  data={this.state.RegionData}
                  style={regionsStyle}
                  ref='regions'
                  onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}
                  pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}
                  onClick={(e) => this.regionClick(e)}
                />
                <If condition={this.state.regionsReady}>
                  <Then>
                    <RegionLabels regionsLabelsArray={this.state.regionsLabelArray} />
                  </Then>
                  <Else>{() => null }</Else>
                </If>
              </div>
            </Then>
            <Else>{() => null }</Else>
          </If>


    		</Pane>
      </LayerGroup>
  	)
  }
}


export default Regions;