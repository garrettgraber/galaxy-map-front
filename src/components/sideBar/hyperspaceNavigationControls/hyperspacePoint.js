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
    return LocationGalacticDisplay(Point);
  }
}

function systemLocationDisplay(Location) {

  return (
    <div className="pane-row-text">
      <If condition={Location.system}>
        <Then>
          <span className="display-text">Location:&nbsp;&nbsp;{Location.system}</span>
        </Then>
        <Else>
          <span className="display-text">Location:&nbsp;&nbsp;</span>
        </Else>
      </If>
    </div>
  );

}


function LocationGalacticDisplay(Point) {
  const xGalacticLongIsNotSet = isNaN(Point.xGalacticLong);
  const yGalacticLongIsNotSet = isNaN(Point.yGalacticLong);

  return (
    <div className="pane-row-text">
      <span className="display-text">Position:&nbsp;</span>

      <If condition={xGalacticLongIsNotSet}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;X:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;X:&nbsp;&nbsp;{parseFloat(Point.xGalacticLong).toFixed(6)}</span>
        </Else>
      </If>

      <If condition={yGalacticLongIsNotSet}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;Y:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;Y:&nbsp;&nbsp;{parseFloat(Point.yGalacticLong).toFixed(6)}</span>
        </Else>
      </If>
    </div>
  );
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