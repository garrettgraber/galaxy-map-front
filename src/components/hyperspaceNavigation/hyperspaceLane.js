import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';

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
    // console.log("StarSystem has mounted: ", this);
    // console.log("lane ref in componet: ", this.refs.lane);

    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
      const HyperSpaceLaneObject = this.props.HyperSpaceLaneObject;
      // _.forEach(HyperSpaceLaneObject.coordinates, function(el) {
      //   el.reverse();
      // });
      // HyperSpaceLaneObject.reverseCoordinatesLatLng();
      // const starPoints = this.props.map.latLngToLayerPoint(StarObject.latLng);

      // console.log("lane: ", lane);
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
    const laneColor = 'gold';
    const laneColorPink =  '#FF69B4';
    // const fillColor = '#f03';
    // const fileOpacity = 0.5;
    // const textWidth = this.props.HyperSpaceLaneObject.textWidth;
    // const starLocation = [ this.props.HyperSpaceLaneObject.lat, this.props.HyperSpaceLaneObject.lng ];
    // let myIcon = L.divIcon({
    //   className: "systemLabel",
    //   iconSize: new L.Point(this.props.HyperSpaceLaneObject.textWidth + 30, 24),
    //   iconAnchor: new L.Point(textWidth / 3.0, 18),
    //   // iconAnchor: new L.Point(0, 0),
    //   html: this.props.HyperSpaceLaneObject.name
    // });
  	return (
      <div>
        <Polyline positions={this.props.HyperSpaceLaneObject.coordinates} color={laneColorPink} ref="lane" onMouseOver={e => this.onMouseOver(e)}  onMouseOut={e => this.onMouseOut(e)}/>
      </div>                         
  	)
  }
}

 // <Marker key={this.props.HyperSpaceLaneObject.hyperspaceHash} position={starLocation} icon={myIcon} zIndexOffset={-5} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='laneText'/>

export default HyperSpaceLane;