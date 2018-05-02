import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import AntPath from "react-leaflet-ant-path";
import { If, Then, Else } from 'react-if';
import distance from 'euclidean-distance';

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
    this.state = {
      jumpDistance: null
    };
  }
  componentDidMount() {
    const Point = this.props.HyperSpacePoint;
    const Node = this.props.HyperSpaceNode;
    const distanceBetweenNodeAndPoint = distance([Point.xGalactic, Point.yGalactic], [Node.xGalactic, Node.yGalactic]);
    this.setState({jumpDistance: distanceBetweenNodeAndPoint});
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

    const LaneOptions = {
      opacity: 0.0,
      interactive: true,
      weight: 10
    };

    if(this.props.isStart) {
      jumpCoordinates.reverse();
    }

    const freeSpaceJumpDistance = (this.state.jumpDistance)? parseFloat(this.state.jumpDistance.toFixed(2)) : 0;
    const startName = (this.props.isStart)? this.props.HyperSpacePoint.system : this.props.HyperSpaceNode.system;
     const endName = (this.props.isStart)? this.props.HyperSpaceNode.system : this.props.HyperSpacePoint.system;

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
                    interactive: true,
                    delay: freeSpaceJumpDelay
                  }
                }
                ref="lane"
                onMouseOver={e => this.onMouseOver(e)}
                onMouseOut={e => this.onMouseOut(e)}
              >
                <Popup className="active-hyperspace-lane-popup" ref="popupFreeSpace" minWidth={90} autoPan={false}>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Free Space Jump</span><br/>
                    <span>Distance:&nbsp;{freeSpaceJumpDistance.toLocaleString()}&nbsp;&nbsp;parsecs</span><br/>
                    <span>Start:&nbsp;{startName}</span><br/>
                    <span>End&nbsp;:&nbsp;{endName}</span><br/>
                  </div>
                </Popup>
              </AntPath>
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