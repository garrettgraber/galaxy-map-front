import React from 'react';
import { If, Then, Else } from 'react-if';

import LatLngDisplay from './latLngDisplay.js';

import '../../../css/main.css';

class HyperspacePoint extends React.Component {
  constructor() {
    super();
  }
  render() {
    const Point = this.props.Point;
    return LocationDisplay(Point);
  }
}

function LocationDisplay(Point) {
  return (
    <div className="pane-row-text">
      <If condition={Point.lat === null && Point.lng === null}>
        <Then>
          <span className="display-text">Point:&nbsp;&nbsp;None</span>
        </Then>
        <Else>
          <span className="display-text">Point:&nbsp;&nbsp;{Point.system.slice(0, 10)}</span>
        </Else>
      </If>

      <If condition={Point.lat === null}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;Lat:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;Lat:&nbsp;&nbsp;{parseFloat(Point.lat).toFixed(6)}</span>
        </Else>
      </If>

      <If condition={Point.lng === null}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;Lng:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;Lng:&nbsp;&nbsp;{parseFloat(Point.lng).toFixed(6)}</span>
        </Else>
      </If>
    </div>
  );
}


export default HyperspacePoint;