import React from 'react';
import { connect } from 'react-redux';
import { Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

class StarSystemNavigationPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const starLocation = this.props.starLocation;
    const startOrEndString = (this.props.isStart)? 'Start' : 'End';

  	return (
      <Popup className="star-system-start-popup"  minWidth={90} position={starLocation} autoPan={false}>
        <div>
          <span>Selecting as {startOrEndString} System...</span><br/>
        </div>
      </Popup>
  	)
  }
}

export default StarSystemNavigationPopup;