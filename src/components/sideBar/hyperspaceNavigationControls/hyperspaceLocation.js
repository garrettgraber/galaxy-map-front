import React from 'react';
import { If, Then, Else } from 'react-if';

import LatLngDisplay from './latLngDisplay.js';

import '../../../css/main.css';

class HyperspaceLocation extends React.Component {
  constructor() {
    super();
  }
  render() {
    const Point = this.props.Point;
    return systemLocationDisplay(Point);
  }
}

function systemLocationDisplay(Location) {

  return (
    <div className="pane-row-text">
      <If condition={validHyperspacePoints(Location.system)}>
        <Then>
          <span className="display-text">Location:&nbsp;&nbsp;{emptySpaceCheck(Location.system)}</span>
        </Then>
        <Else>
          <span className="display-text">Location:&nbsp;&nbsp;</span>
        </Else>
      </If>
    </div>
  );

}

function emptySpaceCheck(system) {
  if(system.includes('@')) {
    const splitSystem = system.split('@');
    const emptySpaceHash = splitSystem[1];
    const emptySpaceName = "Empty Space " + emptySpaceHash.slice(0, 10);
    return emptySpaceName;
  } else {
    return system;
  }
}



function validHyperspacePoints(systemName) {
  if(systemName === '') {
    return false;
  } else {
    return true;
  }
}




export default HyperspaceLocation;