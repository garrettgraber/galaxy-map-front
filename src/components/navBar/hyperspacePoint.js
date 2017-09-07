import React from 'react';
import LatLngDisplay from './latLngDisplay.js';

import '../../css/main.css';

class HyperspacePoint extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {

  } 

  render() {
    const Point = this.props.Point;
    return LocationDisplay(Point);
  }
}


function LocationDisplay(Point) {
  if(!Point.lat || !Point.lng) {
    return (<div className="pane-row-text">
        <span className="display-text">Point:&nbsp;&nbsp;None</span>
        <span>
          <span className="display-text">&nbsp;&nbsp;Lat:&nbsp;&nbsp;</span>
          <span className="display-text">&nbsp;&nbsp;Lng:&nbsp;&nbsp;</span>
        </span>
      </div>);
  } else {
    return (<div className="pane-row-text">
        <span className="display-text">Point:&nbsp;&nbsp;{(Point.system.length > 10)? Point.system.slice(0, 13) : Point.system}</span>
        <LatLngDisplay lat={Point.lat} lng={Point.lng} />
      </div>
    );
  }
}


export default HyperspacePoint;