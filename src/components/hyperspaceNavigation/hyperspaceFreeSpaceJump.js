import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import AntPath from "react-leaflet-ant-path";
import { If, Then, Else } from 'react-if';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import '../../css/main.css';

const freeSpaceJumpSlowdownModifier = 10;
const freeSpaceJumpDelay = 400 * freeSpaceJumpSlowdownModifier;


class HyperSpaceFreeSpaceJump extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
    }
  }
  componentWillReceiveProps(newProps) {}
  onMouseOver(e) {
    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
    } else {
      console.log("no this.refs.lane");
    }
  }
  onMouseOut(e) {
    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
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
    let jumpCoordinates = freeSpaceJumpCoordinates(HyperSpacePoint, HyperSpaceNode);

    if(this.props.isStart) {
      jumpCoordinates.reverse();
    }
 
  	return (
      <div >
        <If condition={nodeAndPointAreEqual(HyperSpacePoint, HyperSpaceNode)}>
          <Then>{() => null }</Then>
          <Else>
            <div>
              <AntPath
                positions={jumpCoordinates}
                options={
                  {
                    color: this.props.styleOfJump.color,
                    opacity: 0.4,
                    interactive: false,
                    delay: freeSpaceJumpDelay
                  }
                }
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