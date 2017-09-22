import React from 'react';
import { If, Then, Else } from 'react-if';

import LatLngDisplay from './latLngDisplay.js';

import '../../css/main.css';

class HyperspaceNode extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {

  } 

  render() {
    const Node = this.props.Node;
    return LocationDisplay(Node);
  }
}



function LocationDisplay(Node) {

  return (
    <div className="pane-row-text">
      <If condition={Node.lat === null && Node.lng === null}>
        <Then>
          <span className="display-text">Node:&nbsp;&nbsp;None</span>
        </Then>
        <Else>
          <span className="display-text">Node:&nbsp;&nbsp;{Node.system}</span>
        </Else>
      </If>

      <If condition={Node.lat === null}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;Lat:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;Lat:&nbsp;&nbsp;{Node.lat}</span>
        </Else>
      </If>

      <If condition={Node.lng === null}>
        <Then>
          <span className="display-text">&nbsp;&nbsp;Lng:&nbsp;&nbsp;</span>
        </Then>
        <Else>
          <span className="nav-text">&nbsp;&nbsp;Lng:&nbsp;&nbsp;{Node.lng}</span>
        </Else>
      </If>
    </div>
  );
}



export default HyperspaceNode;
