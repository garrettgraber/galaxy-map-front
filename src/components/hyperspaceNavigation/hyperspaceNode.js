import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class HyperSpaceNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }
  componentDidMount() {
    if(this.refs.nodeHyperSpace && this.refs.nodeText) {
      const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
      const HyperSpaceNodeObject = this.props.HyperSpaceNodeObject;
      nodeHyperSpace.bindPopup(HyperSpaceNodeObject.system + "</span><br/><span>Node Id: " + HyperSpaceNodeObject.nodeId + "<br/>" + "<span>lat:" + HyperSpaceNodeObject.lat + "</span><br/><span>lng: " + HyperSpaceNodeObject.lng + "</span></br><span>Hyperspace Lanes:" + HyperSpaceNodeObject.hyperspaceLanes.join(", ") + "</span>");
    }
  }
  componentWillReceiveProps(newProps) {
    // console.log("Props update Star System: ", newProps);
  }
  onMouseOver(e) {
    if(this.refs.nodeHyperSpace && this.refs.nodeText) {
      const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
      nodeHyperSpace.openPopup();
    }
  }
  onMouseOut(e) {
    if(this.refs.nodeHyperSpace && this.refs.nodeText) {
      const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
      nodeHyperSpace.closePopup();
    }
  }
  render() {
    // const nodeColor = 'green';
    // const fillColor = 'green';
    const nodeColor = 'gold';
    const fillColor = 'gold';
    // const nodeColor = 'red';
    // const fillColor = 'red';
    const fillOpacity = 1.0;
    const textWidth = this.props.HyperSpaceNodeObject.textWidth;
    const hyperspaceNodeLocation = [this.props.HyperSpaceNodeObject.lat, this.props.HyperSpaceNodeObject.lng];
    let myIcon = L.divIcon({
      className: "hyperspaceNodeLabel",
      iconSize: new L.Point(this.props.HyperSpaceNodeObject.textWidth + 30, 24),
      iconAnchor: new L.Point(textWidth / 3.0, 18),
      // iconAnchor: new L.Point(0, 0),
      html: this.props.HyperSpaceNodeObject.system
    });
  	return (
      <div>
        <CircleMarker center={hyperspaceNodeLocation} radius={1} color={nodeColor} fillColor={fillColor} fillOpacity={fillOpacity} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='nodeHyperSpace' />
        <Marker key={this.props.HyperSpaceNodeObject.system} position={hyperspaceNodeLocation} icon={myIcon} zIndexOffset={5} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='nodeText'/>
      </div>                     
  	)
  }
}


export default HyperSpaceNode;