import React from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import AntPath from "react-leaflet-ant-path";

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class HyperSpaceLaneOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) { }

  onMouseOver(e) { }

  onMouseOut(e) { }

  render() {
    const laneColorGold = 'gold';
    const laneColorPink =  '#FF69B4';
    const laneColorLightGreen = '#90EE90';
    const opacityOfPath = (this.props.isSinglePath)? 0.6 : 0.25;
    
  	return (
      <div>
        <AntPath
          positions={this.props.pathCoordinates}
          options={{color: laneColorPink, opacity: opacityOfPath, interactive: false, weight: 4}}
          ref="lane"
          onMouseOver={e => this.onMouseOver(e)}
          onMouseOut={e => this.onMouseOut(e)}
        />
      </div>                         
  	)
  }
}

export default HyperSpaceLaneOverlay;