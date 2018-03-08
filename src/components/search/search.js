import React from 'react';
import { connect } from 'react-redux';
import {
  Pane,
  GeoJSON,
  CircleMarker,
  Popup,
  Circle,
  Tooltip,
  Marker,
  FeatureGroup,
  LayerGroup,
  Polygon
} from 'react-leaflet';
import L from 'leaflet';
import { If, Then, Else } from 'react-if';
import width from 'text-width';
import 'whatwg-fetch';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';
import distance from 'euclidean-distance';
import Geohash from 'latlon-geohash';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SearchComponents: []
    };
  }

  componentDidMount() {
    // this.setState({zoom: this.props.newZoom});

  }

  componentWillReceiveProps(newProps) {

  }

  render() {

  	const zIndex = 255;
    const searchComponents = renderComponentsOrNull(this.state.SearchComponents);

    // console.log("systemsSearchLocation: ", this.props.systemsSearchLocation);

    const systemsSearchLat = this.props.systemsSearchLocation.lat;
    const systemsSearchLng = this.props.systemsSearchLocation.lng;
    const systemsSearchColor = '#c32aff';

    const sectorSearchName = this.props.sectorSearchData.name;

    // console.log("sectorSearchName: ", this.props.sectorSearchData);

    const SectorOptions = {
      fill: true,
      fillColor: 'red',
      fillOpacity: 0.5,
      color: 'red'
    };

    const SectorNameStyle = {
      fontWeight: 'bold'
    };

    const starColor = 'red';
    const fillColor = '#f03';
    const fillOpacity = 0.5;

  	return (
      <LayerGroup>
        <Pane name="search-pane" style={{ zIndex: zIndex }}>
          <FeatureGroup>
            <If condition={systemsSearchLat !== null && systemsSearchLng !== null}>
              <Then>
                <div>
                  <CircleMarker  key={uuidv4()}  center={[systemsSearchLat, systemsSearchLng]} radius={1} color={starColor} fillColor={fillColor} fillOpacity={fillOpacity} />
                  <CircleMarker key={uuidv4()}  className="gps_ring" center={[systemsSearchLat, systemsSearchLng]} radius={8} color={systemsSearchColor} weight={3} />
                </div>
              </Then>
              <Else>
                {() => null}
              </Else>
            </If>
            <If condition={sectorSearchName !== null}>
              <Then>
                <Polygon
                  className="search-sector"
                  positions={this.props.sectorSearchData.coordinates}
                  options={SectorOptions}
                  ref="sectorSearch"
                >
                  <Popup key={uuidv4()} className="search-sector-popup"  minWidth={90} autoPan={false}>
                    <div>
                      <span style={SectorNameStyle} >{sectorSearchName + ' Sector'}</span><br/>
                      <a href={this.props.sectorSearchData.link} rel="external" target="_blank">Wookieepedia Link</a>
                    </div>
                  </Popup>
                </Polygon>
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


function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(Search);