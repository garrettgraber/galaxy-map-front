import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';




import { 
  addSectorSearchSet
} from '../../actions/actionCreators.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


import SectorData from 'json-loader!../../data/sector.geojson';



class Sectors extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  onEachFeature(feature, layer) {
	  if(feature.properties.sector) {
      const sectorName = feature.properties.sector;
      layer.bindPopup(sectorName + " Sector");
      const coordinates = feature.geometry.coordinates[0][0];
      const polygon = L.polygon(coordinates);
      const polygonCenter = polygon.getBounds().getCenter();
      const polygonCenterArray = [polygonCenter.lng, polygonCenter.lat];
      const SectorData = {
        label: sectorName,
        value: polygonCenterArray
      };

      this.props.dispatch(addSectorSearchSet(SectorData));
    }
  }

  pointToLayer(feature, latlng) {
  }

  render() {

  	const zIndex = 220;
  	const sectorsStyle = {color: 'gold', weight: 1, opacity: 0.5};

  	return (
  		<Pane name="sectors-pane" style={{ zIndex: zIndex }}>
  			<GeoJSON data={SectorData} style={sectorsStyle} ref='sectors' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}/>
  		</Pane>
  	)
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(Sectors);
