import React from 'react';
import { connect } from 'react-redux';
import {
  Popup,
  Polygon
} from 'react-leaflet';
import L from 'leaflet';
import { If, Then, Else } from 'react-if';
import uuidv4 from 'uuid/v4';

import { 
    newSearchObjectBoundaries
} from '../../actions/actionCreators.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';

class SectorSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    const sectorSearchElement = this.refs.sectorSearch.leafletElement;
    if(sectorSearchElement) {
      const map = this.props.map;
      this.props.dispatch(newSearchObjectBoundaries(sectorSearchElement.getBounds()));
    }
  }

  componentWillReceiveProps(newProps) {
    const sectorSearchElement = this.refs.sectorSearch.leafletElement;
    const searchDataChange = this.props.sectorSearchData.name !== newProps.sectorSearchData.name;
    if(sectorSearchElement && searchDataChange) {
      const polyline = L.polyline(newProps.sectorSearchData.coordinates);
      const polylineBounds = polyline.getBounds();
      this.props.dispatch(newSearchObjectBoundaries(polylineBounds));
    }
  }

  render() {
    const SectorNameStyle = {
      fontWeight: 'bold'
    };

  	return (
      <Polygon
        className="search-sector pulse-sector"
        positions={this.props.sectorSearchData.coordinates}
        color="crimson"
        ref="sectorSearch"
      >
        <Popup key={uuidv4()} className="search-sector-popup"  minWidth={90} autoPan={false}>
          <div>
            <span style={SectorNameStyle} >{this.props.sectorSearchData.name + ' Sector'}</span><br/>
            <If condition={this.props.sectorSearchData.link !== null}>
              <Then>
                <a href={this.props.sectorSearchData.link} rel="external" target="_blank">Wookieepedia Link</a>
              </Then>
              <Else>
                <span>No Link</span>
              </Else>
            </If>
          </div>
        </Popup>
      </Polygon>
  	)
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SectorSearchResults);