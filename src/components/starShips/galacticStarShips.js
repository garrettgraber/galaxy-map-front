import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup } from 'react-leaflet';
import _ from 'lodash';
import L from 'leaflet';
import width from 'text-width';
import uuidv4 from 'uuid/v4';

import Ship from  './ship.js';
import Fleet from './fleet.js';

import { galacticStarShipsList } from './starShipLists.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';



class GalacticStarShips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fleetComponents: []
    };
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    console.log("Galactic Star Ship Props: ",  props);
    console.log("Galactic Star Ship State: ", state);

    const { shipSelectedForJump, hyperspaceStartPoint, map } = props;
    const currentStartLat = hyperspaceStartPoint.lat;
    const currentStartLng = hyperspaceStartPoint.lng;

    const fleetComponents = [...state.fleetComponents];

    if(!_.isEmpty(shipSelectedForJump) && currentStartLat !== null && currentStartLng !== null) {
      const FleetSelectedForJump = galacticStarShipsList.filter(n => n.name === shipSelectedForJump.name)[0];
      console.log("Fleet Selected for Jump: ", FleetSelectedForJump);

      FleetSelectedForJump.location = [currentStartLat, currentStartLng];
      console.log("Fleet Selected for Jump: ", FleetSelectedForJump);
      fleetComponents.push(fleetComponentGenerator(FleetSelectedForJump, map));
      return {
        fleetComponents: fleetComponents
      };
    } else {
      return null;
    }

    // const fleetComponents = galacticStarShipsList.map(n => <Fleet name={n.name} speed={n.speed} location={n.location} Course={n.Course} icon={n.icon}/>);
    // return state;
    // return {
    //   fleetComponents: fleetComponents
    // };
  }

  generateFleetComponents(fleetList, map) {
    return fleetList.map(n => <Fleet key={uuidv4()} name={n.name} speed={n.speed} location={n.location} Course={n.Course} icon={n.icon} map={map}/>);
  }

  render() {
  	const zIndex = 280;

    const FleetsToRender = renderComponentsOrNull(this.state.fleetComponents);

  	return (
  		<Pane name="star-ships-pane" style={{zIndex: zIndex}}>
  			<FeatureGroup  >  
          { FleetsToRender }
  			</FeatureGroup>
  		</Pane>
  	)
  }

}


function fleetComponentGenerator(FleetData, map) {
  return (<Fleet name={FleetData.name} speed={FleetData.speed} location={FleetData.location} Course={FleetData.Course} key={uuidv4()} map={map} icon={FleetData.icon}/>);
};


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

export default connect(mapStateToProps)(GalacticStarShips);