import React from 'react';
import { connect } from 'react-redux';
import {
  Pane,
  CircleMarker,
  Popup,
  Tooltip,
  Marker,
  FeatureGroup,
  LayerGroup,
  Polygon
} from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import { If, Then, Else } from 'react-if';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';

import StarSystemPopup from '../stars/starSystemPopup.js';

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

  onClick(e) {

    const sectorSearchElement = this.refs.sectorSearch.leafletElement;
    console.log("Click on sector: ", e);


    if(sectorSearchElement) {
      console.log("sectorSearchElement: ", sectorSearchElement);
    }
  }

  render() {
  	const zIndex = 255;
    const searchComponents = renderComponentsOrNull(this.state.SearchComponents);
    const systemsSearchLat = this.props.activeSystem.lat;
    const systemsSearchLng = this.props.activeSystem.lng;
    const systemsSearchColor = 'white';
    const sectorSearchName = this.props.sectorSearchData.name;
    const SectorOptions = {
      fill: 'red',
      // fillColor: 'red',
      // fillOpacity: 0.5,
      // fillRule: 'evenodd'
      color: 'red'
    };
    const SectorNameStyle = {
      fontWeight: 'bold'
    };
    const starColor = 'red';
    const fillColor = '#f03';
    const fillOpacity = 0.5;
    const starLocation = [systemsSearchLat, systemsSearchLng];
    const myIcon = textIconGenerator(this.props.activeSystem.system);

    const sectorsStyle = {color: 'red', weight: 1, opacity: 0.5};

  	return (
      <LayerGroup>
        <Pane name="search-pane" style={{ zIndex: zIndex }}>
          <FeatureGroup>
            <If condition={systemsSearchLat !== null && systemsSearchLng !== null}>
              <Then>
                <div>
                  <CircleMarker key={uuidv4()}  className="expand-ring-pulse-counter" center={starLocation} radius={6} color={systemsSearchColor} weight={2} >
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </CircleMarker>
                  <CircleMarker key={uuidv4()}  className="expand-ring-pulse" center={starLocation} radius={10} color={systemsSearchColor} weight={2}>
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </CircleMarker>

                  <CircleMarker  key={uuidv4()}  center={starLocation} radius={1} color={starColor} fillColor={fillColor} fillOpacity={fillOpacity} >
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </CircleMarker>
                  
                  <Marker key={this.props.activeSystem.system} position={starLocation} zIndexOffset={-5} icon={myIcon}>
                    <StarSystemPopup StarObject={this.props.activeSystem}/>
                  </Marker>
                </div>
              </Then>
              <Else>
                {() => null}
              </Else>
            </If>
            <If condition={sectorSearchName !== null}>
              <Then>
                <Polygon
                  className="search-sector pulse-sector"
                  positions={this.props.sectorSearchData.coordinates}

                  color="crimson"
                  ref="sectorSearch"
                  onClick={(e) => this.onClick(e)}
                >
                  <Popup key={uuidv4()} className="search-sector-popup"  minWidth={90} autoPan={false}>
                    <div>
                      <span style={SectorNameStyle} >{sectorSearchName + ' Sector'}</span><br/>



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


function textIconGenerator(systemName) {
  const textWidth = width(systemName, {size: "1em"});
  let textPadding = 0;
  if(textWidth >= 75) {
    textPadding = 30;
  } else if(textWidth < 75 && textWidth > 40) {
    textPadding = 20;
  } else {
    textPadding = 10;
  }

  return L.divIcon({
    className: "systemSearchLabel",
    iconSize: new L.Point(textWidth + textPadding, 24),
    iconAnchor: new L.Point(textWidth / 2.0, 18),
    html: systemName
  });
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