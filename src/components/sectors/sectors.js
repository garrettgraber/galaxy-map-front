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

import { 
  addSectorSearchSet
} from '../../actions/actionCreators.js';
import ApiService from '../../remoteServices/apiService.js';

class Sectors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SectorData: {}
    }
  }

  componentDidMount() {
    ApiService.sectorGeoJsonData().then(Data => {
      this.setState({SectorData: Data});
    }).catch(err => {
      console.log("Error getting grid sector json data: ", err);
    });
  }

  onEachFeature(feature, layer) {
	  if(feature.properties.sector) {
      const sectorName = feature.properties.sector;
      const link = feature.properties.link;
      const sectorNameString = '<span style="font-weight: bold;">' + sectorName + ' Sector' + '</span><br/>';
      const secotrLinkString = '<a href=' + link + ' rel="external" target="_blank">Wookieepedia Link</a>';
      const sectorPopupString = sectorNameString + secotrLinkString;
      layer.bindPopup(sectorPopupString);
      const coordinates = feature.geometry.coordinates[0][0];
      const polygon = L.polygon(coordinates);
      const polygonCenter = polygon.getBounds().getCenter();
      const polygonCenterArray = [polygonCenter.lng, polygonCenter.lat];
      this.props.dispatch(addSectorSearchSet({
        label: sectorName,
        value: polygonCenterArray
      }));
    }
  }

  pointToLayer(feature, latlng) {}

  render() {
  	const zIndex = 220;
  	const sectorsStyle = {color: 'gold', weight: 1, opacity: 0.5};
  	return (
      <LayerGroup className="layer-group">
    		<Pane name="sectors-pane" style={{ zIndex: zIndex }}>
          <If condition={ !_.isEmpty(this.state.SectorData)}>
            <Then>
              <GeoJSON
                data={this.state.SectorData}
                style={sectorsStyle}
                ref='sectors'
                onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}
                pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}
              />
            </Then>
            <Else>{() => null }</Else>
          </If>
    		</Pane>
      </LayerGroup>
  	)
  }
}

const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Sectors);