import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import AntPath from "react-leaflet-ant-path";


// import ReactFauxDOM from 'react-faux-dom';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class HyperSpaceLane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        open: true
    };
  }
  componentDidMount() {

    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
      const HyperSpaceLaneObject = this.props.HyperSpaceLaneObject;
      lane.bindPopup(HyperSpaceLaneObject.name + "<br/>" + "<span>start: " + HyperSpaceLaneObject.start + "</span><br/><span>end: " + HyperSpaceLaneObject.end + "</span><br /><span>Length: " + HyperSpaceLaneObject.length +  "</span><br/><span>Link :" + HyperSpaceLaneObject.link + "</span>")
      .on('click', function (e) {
          this.openPopup();
      });
    }
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
    
  	return (
      <div>
        <AntPath
          positions={this.props.HyperSpaceLaneObject.coordinates}
          options={{color: laneColorPink, opacity: 0.25, interactive: false}}
          ref="lane"
          onMouseOver={e => this.onMouseOver(e)}
          onMouseOut={e => this.onMouseOut(e)}
        />
      </div>                         
  	)
  }
}


// <Polyline positions={this.props.HyperSpaceLaneObject.coordinates} color={laneColorPink} ref="lane" onMouseOver={e => this.onMouseOver(e)}  onMouseOut={e => this.onMouseOut(e)}/>


export default HyperSpaceLane;