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
        open: true,
        hoverOver: false
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
      this.setState({hoverOver: true});
    console.log("lane mouse over!", this.refs.lane);
    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;
      lane.openPopup();
    } else {
      console.log("no this.refs.lane");
    }
  }
  onMouseOut(e) {
    console.log("lane mouse out!", this.refs.lane);
    this.setState({hoverOver: false});
    if(this.refs.lane) {
      const lane = this.refs.lane.leafletElement;

      lane.closePopup();
    } else {
      console.log("no this.refs.lane");
    }
  }
  onClick(e) {
    
  }
  render() {
    const laneColorGold = 'gold';
    const laneColorPink =  '#FF69B4';
    const laneColorLightGreen = '#90EE90';
    const laneColorOrange = '#FD5F00';

    // console.log("Coke, lanes is isSinglePath: ", this.props.isSinglePath);

    const opacityOfPath = (this.props.isSinglePath)? 0.4 : 0.25;
    const LaneOptions = (this.state.hoverOver)? {opacity: 1.0, interactive: false, fillOpacity: 1.0,fillColor: laneColorOrange} : {opacity: 0.0, interactive: true};

    
  	return (
      <div>
        <Polyline
          positions={this.props.HyperSpaceLaneObject.coordinates}
          options={LaneOptions}
          ref="lane"
          onMouseOver={e => this.onMouseOver(e)}
          onMouseOut={e => this.onMouseOut(e)}
          onClick={(e) => this.onClick(e)}

        />
      </div>                         
  	)
  }
}

export default HyperSpaceLane;