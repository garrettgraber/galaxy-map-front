import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import _ from 'lodash';
import Geohash from 'latlon-geohash';
// import LeafletMovingMarker from 'leaflet-moving-marker';

import uuidv4 from 'uuid/v4';

import Ship from  './ship.js';

import { leafletMovingMarker } from '../../movingMarkerNinja/movingMarker.js';

console.log("leafletMovingMarker: ", leafletMovingMarker);

import {
  jumpIntoHyperspaceCalculated
} from '../hyperspaceNavigation/hyperspaceMethods.js';


import {
  updateNorthEastMapHash
} from '../../actions/actionCreators.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


class StarShips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StarShipComponents: []
    };
  }

  componentDidMount() {
    const coruscantLocation = [0, 0];
    const StartPoint = this.props.hyperspaceActiveStartPoint;

    // console.log("StartPoint: ", StartPoint);

    const startLocation = (StartPoint.lat && StartPoint.lng)? [StartPoint.lat, StartPoint.lng] : coruscantLocation;

    this.state.StarShipComponents.push(<Ship
      key={uuidv4()}
      location={startLocation}
      map={this.props.map}
    />);
  }


  componentWillReceiveProps(newProps) {
    const StartPoint = newProps.hyperspaceActiveStartPoint;

    // console.log("StartPoint: ", StartPoint);

    // if() {
    //   const startLocation = [StartPoint.lat, StartPoint.lng];

    //   this.state.StarShipComponents.push(<Ship
    //     key={uuidv4()}
    //     location={startLocation}
    //     map={this.props.map}
    //   />);
    // }
  }

  render() {
  	const zIndex = 280;
    // const StarShipsToRender = renderComponentsOrNull(this.state.StarShipComponents);
    // console.log("Total Star Components Rendering: ", (this.state.StarMapComponents)? this.state.StarMapComponents.length : null);

    const jumpSuccessfullyCalculated = jumpIntoHyperspaceCalculated({
      hyperspacePathCollections: this.props.hyperspacePathCollections,
      ActiveStartPoint: this.props.hyperspaceActiveStartPoint,
      ActiveStartNode: this.props.hyperspaceActiveStartNode,
      ActiveEndPoint: this.props.hyperspaceActiveEndPoint,
      ActiveEndNode: this.props.hyperspaceActiveEndNode
    });
    const shipHasJumpedToHyperspace = this.props.shipHasJumpedToHyperspace;

    const StarShipsToRender = (jumpSuccessfullyCalculated)? renderComponentsOrNull(this.state.StarShipComponents) : null;

    // console.log("Ship in hyperspace: ", this.props.shipHasJumpedToHyperspace);

  	return (
  		<Pane name="star-ships-pane" style={{zIndex: zIndex}}>
  			<FeatureGroup  >  
          { StarShipsToRender }
  			</FeatureGroup>
  		</Pane>
  	)
  }

}


function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}



const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(StarShips);