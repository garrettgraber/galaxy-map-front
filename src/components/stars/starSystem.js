import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import { If, Then, Else } from 'react-if';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';

import { 
  hyperspacePositionSearch
} from '../../actions/actions.js';
import StarSystemPopup from './starSystemPopup.js';
import StarSystemNavigationPopup from './starSystemNavigationPopup.js';

class StarSystem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {}

  onMouseOver(e) {}

  onMouseOut(e) {}

  onClick(e) {
    if(this.props.pathStartClick || this.props.pathEndClick) {
      const isStartPosition = (this.props.pathStartClick && !this.props.pathEndClick)? true : false;
      this.props.dispatch(hyperspacePositionSearch({
        system: this.props.StarObject.system,
        isStartPosition: isStartPosition
      }));
    }
  }

  render() {
    const StarObject = this.props.StarObject;
    const starColor = 'red';
    const fillColor = '#f03';
    const fillOpacity = 0.5;
    const textWidth = StarObject.textWidth;
    const starLocation = [ StarObject.lat, StarObject.lng ];
    let textPadding = 0;
    if(textWidth >= 75) {
      textPadding = 30;
    } else if(textWidth < 75 && textWidth > 40) {
      textPadding = 20;
    } else {
      textPadding = 10;
    }

    let myIcon = L.divIcon({
      className: "systemLabel",
      iconSize: new L.Point(textWidth + textPadding, 24),
      iconAnchor: new L.Point(textWidth / 3.0, 18),
      html: StarObject.system
    });

    let toolTipIcon = L.divIcon({
      className: "systemTooltip",
      iconSize: new L.Point(StarObject.textWidth + 30, 24),
      iconAnchor: new L.Point(textWidth / 3.0, 36),
      html: StarObject.system
    });

  	return (
      <div style={ {caretColor: 'teal'} }>
        <CircleMarker center={starLocation} radius={1} color={starColor} fillColor={fillColor} fillOpacity={fillOpacity} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} onClick={(e) => this.onClick(e)}  ref='star'>
          <If condition={this.props.pathStartClick || this.props.pathEndClick}>
            <Then>
              <If condition={this.props.pathStartClick}>
                <Then>
                  <StarSystemNavigationPopup isStart={true} starLocation={starLocation}/>
                </Then>
                <Else>
                  <StarSystemNavigationPopup isStart={false} starLocation={starLocation}/>
                </Else>
              </If>
            </Then>
            <Else>
              <StarSystemPopup StarObject={StarObject}/>
            </Else>
          </If>
        </CircleMarker>
        <Marker key={StarObject.system} position={starLocation} zIndexOffset={-5} icon={myIcon}  onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)}  onClick={(e) => this.onClick(e)} ref='starText'>
          <If condition={this.props.pathStartClick || this.props.pathEndClick}>
            <Then>
              <If condition={this.props.pathStartClick}>
                <Then>
                  <StarSystemNavigationPopup isStart={true} starLocation={starLocation}/>
                </Then>
                <Else>
                  <StarSystemNavigationPopup isStart={false} starLocation={starLocation}/>
                </Else>
              </If>
            </Then>
            <Else>
              <StarSystemPopup StarObject={StarObject}/>
            </Else>
          </If>
        </Marker>
      </div>                                          
  	)
  }
}

const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(StarSystem);