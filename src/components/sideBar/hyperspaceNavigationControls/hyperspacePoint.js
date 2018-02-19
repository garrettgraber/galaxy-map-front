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

export default HyperspacePoint;