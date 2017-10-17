import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import AntPath from "react-leaflet-ant-path";
import { If, Then, Else } from 'react-if';


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
  
    const nodeColor = 'gold';
    const fillColor = 'gold';
    const pointColor = 'teal';
    const fillOpacity = 0.5;
    const hyperspaceNodeLocation = [HyperSpaceNode.lat, HyperSpaceNode.lng];
    const hyperspacePointLocation = [HyperSpacePoint.lat, HyperSpacePoint.lng];
    const jumpCoordinates = freeSpaceJumpCoordinates(HyperSpacePoint, HyperSpaceNode);
 
  	return (
      <div >
        <If condition={nodeAndPointAreEqual(HyperSpacePoint, HyperSpaceNode)}>
          <Then>{() => null }</Then>
          <Else>
            <div>
              
              <AntPath
                positions={jumpCoordinates}
                options={{color: laneColorPink, opacity: 0.25, interactive: false}}
                ref="lane"
                onMouseOver={e => this.onMouseOver(e)}
                onMouseOut={e => this.onMouseOut(e)}
              />

              <CircleMarker center={hyperspaceNodeLocation} radius={1} color={nodeColor} ref='nodeHyperSpace' />
            </div>
          </Else>
        </If>
        <div>
          <CircleMarker center={hyperspacePointLocation} radius={1} color={'red'}  ref='starPoint' />
          
        </div>
      </div>                         
  	)
  }
}


// <CircleMarker className="pulse" center={hyperspacePointLocation} radius={4} color={'#87CEFA'} ref='pointHyperSpace' />

function freeSpaceJumpCoordinates(Point, Node) {
  const PointCoordinates = [Point.lat, Point.lng];
  const NodeCoordinates = [Node.lat, Node.lng];
  const jumpCoordinates = [NodeCoordinates, PointCoordinates];
  return jumpCoordinates;
}


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