import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import AntPath from "react-leaflet-ant-path";


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class HyperSpaceLaneOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        open: true
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(newProps) {
    // console.log("Props update Star System: ", newProps);
  }
  onMouseOver(e) {

    // console.log("lane mouse over!");
    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
      // lane.openPopup();
    } else {
      console.log("no this.refs.lane");
    }
  }
  onMouseOut(e) {
    // console.log("lane mouse over!");

    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
      // lane.closePopup();
    } else {
      console.log("no this.refs.lane");
    }
  }
  render() {
    const laneColorGold = 'gold';
    const laneColorPink =  '#FF69B4';
    const laneColorLightGreen = '#90EE90';

    // console.log("Coke, lanes is isSinglePath: ", this.props.isSinglePath);

    const opacityOfPath = (this.props.isSinglePath)? 0.6 : 0.25;
    
  	return (
      <div>
        <AntPath
          positions={this.props.pathCoordinates}
          options={{color: laneColorPink, opacity: opacityOfPath, interactive: false}}
          ref="lane"
          onMouseOver={e => this.onMouseOver(e)}
          onMouseOut={e => this.onMouseOut(e)}
        />
      </div>                         
  	)
  }
}

export default HyperSpaceLaneOverlay;