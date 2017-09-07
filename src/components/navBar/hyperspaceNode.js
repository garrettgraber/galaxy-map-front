import React from 'react';
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
  if(!Node.lat || !Node.lng) {
    return (<div className="pane-row-text">
        <span className="display-text">Node:&nbsp;&nbsp;None</span>
        <span>
          <span className="display-text">&nbsp;&nbsp;Lat:&nbsp;&nbsp;</span>
          <span className="display-text">&nbsp;&nbsp;Lng:&nbsp;&nbsp;</span>
        </span>
      </div>);
  } else {
    return (<div className="pane-row-text">
        <span className="display-text">Node:&nbsp;&nbsp;{Node.system}</span>
        <LatLngDisplay lat={Node.lat} lng={Node.lng} />
      </div>
    );
  }
}



export default HyperspaceNode;
