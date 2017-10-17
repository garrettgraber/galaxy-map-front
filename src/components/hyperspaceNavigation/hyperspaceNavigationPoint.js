import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import uuidv4 from 'uuid/v4';

// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class HyperspaceNavigationPoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    // if(this.refs.nodeHyperSpace && this.refs.nodeText) {
    //   const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
    //   const HyperSpaceNodeObject = this.props.HyperSpaceNodeObject;
    //   nodeHyperSpace.bindPopup(HyperSpaceNodeObject.system + "</span><br/><span>Node Id: " + HyperSpaceNodeObject.nodeId + "<br/>" + "<span>lat:" + HyperSpaceNodeObject.lat + "</span><br/><span>lng: " + HyperSpaceNodeObject.lng + "</span></br><span>Hyperspace Lanes:" + HyperSpaceNodeObject.hyperspaceLanes.join(", ") + "</span>");
    // }
  }
  componentWillReceiveProps(newProps) {
    // console.log("Props update Star System: ", newProps);
  }
  onMouseOver(e) {
    // if(this.refs.nodeHyperSpace && this.refs.nodeText) {
    //   const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
    //   nodeHyperSpace.openPopup();
    // }
  }
  onMouseOut(e) {
    // if(this.refs.nodeHyperSpace && this.refs.nodeText) {
    //   const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
    //   nodeHyperSpace.closePopup();
    // }
  }
  render() {
    // const nodeColor = 'green';
    // const fillColor = 'green';

    const pointColor = 'red';
    const fillColor = 'red';

    const fillOpacity = 1.0;

    const HyperspacePointCurrent = this.props.HyperSpacePoint;
    const pointIsEmptySpace = HyperspacePointCurrent.system.slice(0,3) === 'ES@';

    // let myIcon = null;

    // if(pointIsEmptySpace) {

    //   const textWidth = HyperspacePointCurrent.system.textWidth;
    //   const hyperspaceNodeLocation = [HyperspacePointCurrent.lat, HyperspacePointCurrent.lng];
    //   let myIcon = L.divIcon({
    //     className: "hyperspaceNodeLabel",
    //     iconSize: new L.Point(HyperspacePointCurrent.textWidth + 30, 24),
    //     iconAnchor: new L.Point(textWidth / 3.0, 18),
    //     // iconAnchor: new L.Point(0, 0),
    //     html: HyperspacePointCurrent.system
    //   });

    // }



    

    const hyperspacePointLocation = [this.props.HyperSpacePoint.lat, this.props.HyperSpacePoint.lng];
    const LocationColorCyan = '#87CEFA';
    const LocationColor = (this.props.isStart)? '#49fb35' : '#ff0101';

  	return (
      <div key={this.props.HyperSpacePoint.system + ":" + uuidv4()}>
        <CircleMarker center={hyperspacePointLocation} radius={1} color={pointColor}  onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} />
        <CircleMarker className="pulse" center={hyperspacePointLocation} radius={6} color={LocationColorCyan}/>
        <CircleMarker className="pulse-counter" center={hyperspacePointLocation} radius={8} color={LocationColor}/>
      </div>                  
  	)
  }
}


// <div>
//   <CircleMarker center={hyperspaceNodeLocation} radius={1} color={nodeColor} fillColor={fillColor} fillOpacity={fillOpacity} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='nodeHyperSpace' />
//   <Marker key={this.props.HyperSpaceNodeObject.system} position={hyperspaceNodeLocation} icon={myIcon} zIndexOffset={5} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='nodeText'/>
// </div>   


export default HyperspaceNavigationPoint;