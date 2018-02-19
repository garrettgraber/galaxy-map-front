import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import _ from 'lodash';
import Geohash from 'latlon-geohash';

import HyperSpaceLane from '../../classes/hyperspaceLane.js';
import Planet from '../../classes/planet.js';

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
      StarShipComponents: [],
    
      previousIntersectionMap: new Set(),    
    };
  }

  render() {
  	const zIndex = 295;
    // const StarShipsToRender = renderComponentsOrNull(this.state.StarShipComponents);
   //  console.log("Total Star Components Rendering: ", (this.state.StarMapComponents)? this.state.StarMapComponents.length : null);

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

// export default StarShips;
export default connect(mapStateToProps)(StarShips);