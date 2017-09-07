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

import '../../css/main.css';


class HyperSpaceFreeSpaceJump extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("HyperSpaceFreeSpaceJump has mounted");
    // console.log("lane ref in componet: ", this.refs.lane);

    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
      // const HyperSpaceNode = this.props.HyperSpaceNode;
      // const HyperSpacePoint = this.props.HyperSpacePoint;
      // _.forEach(HyperSpaceLaneObject.coordinates, function(el) {
      //   el.reverse();
      // });
      // HyperSpaceLaneObject.reverseCoordinatesLatLng();
      // const starPoints = this.props.map.latLngToLayerPoint(StarObject.latLng);

      // console.log("lane: ", lane);
      // lane.bindPopup(HyperSpaceLaneObject.name + "<br/>" + "<span>start: " + HyperSpaceLaneObject.start + "</span><br/><span>end: " + HyperSpaceLaneObject.end + "</span><br /><span>Length: " + HyperSpaceLaneObject.length +  "</span><br/><span>Link :" + HyperSpaceLaneObject.link + "</span>")
      // .on('click', function (e) {
      //     this.openPopup();
      // });
    }
  }
  componentWillReceiveProps(newProps) {
    // console.log("Props update Star System: ", newProps);
    // const HyperSpaceNode = this.props.HyperSpaceNode;
    // const HyperSpacePoint = this.props.HyperSpacePoint;
    // console.log("HyperSpacePoint: ", HyperSpacePoint);
    // console.log("HyperSpaceNode: ", HyperSpaceNode);
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
    const HyperSpaceNode = this.props.HyperSpaceNode;
    const HyperSpacePoint = this.props.HyperSpacePoint;
    const laneColor = 'gold';
    const laneColorPink =  '#FF69B4';
  
    const nodeColor = 'green';
    const fillColor = 'green';
    const pointColor = 'teal';
    const fillOpacity = 0.5;
    const hyperspaceNodeLocation = [HyperSpaceNode.lat, HyperSpaceNode.lng];
    const hyperspacePointLocation = [HyperSpacePoint.lat, HyperSpacePoint.lng];

    
    // console.log("HyperSpacePoint: ", HyperSpacePoint);
    // console.log("HyperSpaceNode: ", HyperSpaceNode);
    const jumpCoordinates = freeSpaceJumpCoordinates(this.props.HyperSpacePoint, this.props.HyperSpaceNode);
    // const jumpCoordinates = [[0.0000, 0.0000], [85.4297, -72.9196], [2.4061, 78.7271]];
    // const jumpCoordinates = [[0.0000, 0.0000], [-72.9196, 85.4297], [-78.7271, 2.4061]];

    // console.log("jumpCoordinates: ", jumpCoordinates);
    // console.log("this.props.HyperSpacePoint: ", this.props.HyperSpacePoint);
    // console.log("this.props.HyperSpaceNode: ", this.props.HyperSpaceNode);

     // Lat:  -72.9196  Lng:  85.4297
     // Lat:  -78.7271  Lng:  2.4061




  	return (
      <div >
        { (nodeAndPointAreEqual(this.props.HyperSpacePoint, this.props.HyperSpaceNode))? (null) : 
          ( <div>
              <Polyline positions={jumpCoordinates} color={laneColor}  ref="lane" onMouseOver={e => this.onMouseOver(e)}  onMouseOut={e => this.onMouseOut(e)}/>
              <CircleMarker center={hyperspaceNodeLocation} radius={1} color={nodeColor} ref='nodeHyperSpace' />
            </div>
          )
        }
        <div>
          <CircleMarker center={hyperspacePointLocation} radius={1} color={'red'}  ref='starPoint' />
          <CircleMarker className="pulse" center={hyperspacePointLocation} radius={4} color={'#87CEFA'} ref='pointHyperSpace' />
        </div>
      </div>                         
  	)
  }
}


function freeSpaceJumpCoordinates(Point, Node) {
  const PointCoordinates = [Point.lat, Point.lng];
  const NodeCoordinates = [Node.lat, Node.lng];
  const jumpCoordinates = [NodeCoordinates, PointCoordinates];
  return jumpCoordinates;
}

 // <Marker key={this.props.HyperSpaceLaneObject.hyperspaceHash} position={starLocation} icon={myIcon} zIndexOffset={-5} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='laneText'/>


function nodeAndPointAreEqual(point1, point2) {
  const sameName = (point1.system === point2.system)? true : false;
  const sameLatitude = (point1.lat === point2.lat)? true : false;
  const sameLongitude = (point1.lng === point2.lng)? true : false;
  if(sameName && sameLatitude && sameLongitude) {
    return true;
  } else {
    return false;
  }
}


export default HyperSpaceFreeSpaceJump;