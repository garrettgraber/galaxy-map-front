import React from 'react';
import { If, Then, Else } from 'react-if';

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

function LocationGalacticDisplay(Point) {
  const xGalacticIsNotSet = (Point.xGalactic === null)? true : false;
  const yGalacticIsNotSet = (Point.yGalactic === null)? true : false;
  return (
    <div className="pane-row-text">
      <span className="display-text">Position:&nbsp;</span>
      <If condition={xGalacticIsNotSet}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;X:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;X:&nbsp;&nbsp;{parseFloat(Point.xGalactic).toFixed(2)}</span>
        </Else>
      </If>
      <If condition={yGalacticIsNotSet}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;Y:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;Y:&nbsp;&nbsp;{parseFloat(Point.yGalactic).toFixed(2)}</span>
        </Else>
      </If>
    </div>
  );
}

export default HyperspacePoint;