import React from 'react';
import { connect } from 'react-redux';
import {
  Pane,
  FeatureGroup,
  LayerGroup,
} from 'react-leaflet';
import L from 'leaflet';
import { If, Then, Else } from 'react-if';

import HyperspaceLaneSearchResults from './hyperspaceLaneSearchResults.js';
import SectorSearchResults from './sectorSearchResults.js';
import SystemsSearchResults from './systemsSearchResults.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) { }

  render() {
  	const zIndex = 255;

  	return (
      <LayerGroup>
        <Pane name="search-pane" style={{ zIndex: zIndex }}>
          <FeatureGroup>
            <If condition={this.props.hyperspaceRouteSearchData.name !== null}>
              <Then>
                <HyperspaceLaneSearchResults map={this.props.map}/>
              </Then>
              <Else>
                {() => null}
              </Else>
            </If>
            <If condition={this.props.sectorSearchData.name !== null}>
              <Then>
                <SectorSearchResults map={this.props.map}/>
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

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(Search);