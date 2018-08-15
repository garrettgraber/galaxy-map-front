import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import uuidv4 from 'uuid/v4';

import Ship from  './ship.js';

import {
  jumpIntoHyperspaceCalculated,
  nodeAndPointAreEqual,
  isPointBlank
} from '../hyperspaceNavigation/hyperspaceMethods.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


class StarShips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StarShipComponents: [],
      startShipsShouldRender: false
    };
  }

  componentDidMount() {
    const coruscantLocation = [0, 0];
    const StartPoint = this.props.hyperspaceActiveStartPoint;
    const startLocation = (StartPoint.lat && StartPoint.lng)? [StartPoint.lat, StartPoint.lng] : coruscantLocation;
    this.state.StarShipComponents.push(<Ship
      key={uuidv4()}
      location={startLocation}
      map={this.props.map}
    />);
    this.setState({startShipsShouldRender: true});
  }

  componentWillReceiveProps(newProps) {
    const StartPoint = newProps.hyperspaceActiveStartPoint;
    const OldStartPoint = this.props.hyperspaceActiveStartPoint;
    const oldAndNewStartPointsAreTheSame = nodeAndPointAreEqual(StartPoint, OldStartPoint);
    const newStartPointIsBlank = isPointBlank(StartPoint);

    if(!oldAndNewStartPointsAreTheSame && !newStartPointIsBlank) {
      const startLocation = [StartPoint.lat, StartPoint.lng];
      this.state.StarShipComponents.push(<Ship
        key={uuidv4()}
        location={startLocation}
        map={this.props.map}
      />);
      this.setState({startShipsShouldRender: true});
    }

    if(newStartPointIsBlank) {
      this.setState({startShipsShouldRender: false});
    }
  }

  render() {
  	const zIndex = 280;
    const jumpSuccessfullyCalculated = jumpIntoHyperspaceCalculated({
      hyperspacePathCollections: this.props.hyperspacePathCollections,
      ActiveStartPoint: this.props.hyperspaceActiveStartPoint,
      ActiveStartNode: this.props.hyperspaceActiveStartNode,
      ActiveEndPoint: this.props.hyperspaceActiveEndPoint,
      ActiveEndNode: this.props.hyperspaceActiveEndNode
    });
    const StarShipsToRender = (jumpSuccessfullyCalculated)? renderComponentsOrNull(this.state.StarShipComponents) : null;

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
};

const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(StarShips);