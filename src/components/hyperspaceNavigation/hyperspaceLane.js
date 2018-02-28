import React from 'react';
import { connect } from 'react-redux';
import { Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { If, Then, Else } from 'react-if';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class HyperSpaceLane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) { }

  onMouseOver(e) { }

  onMouseOut(e) { }

  onClick(e) { }

  render() {
    const LaneOptions = {
      opacity: 0.0,
      interactive: true,
      weight: 10
    };
    const HyperSpaceLaneObject = this.props.HyperSpaceLaneObject;

  	return (
      <div>
        <Polyline
          positions={HyperSpaceLaneObject.coordinates}
          options={LaneOptions}
          ref="lane"
          onMouseOver={e => this.onMouseOver(e)}
          onMouseOut={e => this.onMouseOut(e)}
          onClick={(e) => this.onClick(e)}
        >
          <Popup className="active-hyperspace-lane-popup" ref="popup" minWidth={90} autoPan={false}>
            <div>
              <span style={{fontWeight: 'bold'}}>{HyperSpaceLaneObject.name}</span><br/>
              <span>Distance:&nbsp;{HyperSpaceLaneObject.length}</span><br/>
              <span>Start:&nbsp;{HyperSpaceLaneObject.start}</span><br/>
              <span>End:&nbsp;&nbsp;{HyperSpaceLaneObject.end}</span><br/>
              <If condition={HyperSpaceLaneObject.link === 'No Link'}>
                <Then>
                  <span>No Link</span>
                </Then>
                <Else>
                  <a href={HyperSpaceLaneObject.link} rel="external" target="_blank">Wookieepedia Link</a>
                </Else>
              </If>              
            </div>
          </Popup>
        </Polyline>
      </div>                    
  	)
  }
}

export default HyperSpaceLane;