import React from 'react';
import { connect } from 'react-redux';
import { Circle, Marker, CircleMarker } from 'react-leaflet';
import { If, Then, Else } from 'react-if';
import L from 'leaflet';
import distance from 'euclidean-distance';
import $ from "jquery";


import 'rotate-icon';

import 'leaflet-rotatedmarker';





import width from 'text-width';
import _ from 'lodash';
import Geohash from 'latlon-geohash';
import moment from 'moment';


import uuidv4 from 'uuid/v4';


import falconImage from '../../images/icons/falcon-icons/falcon-color.png';






class StationaryShip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipIcon: getShipIconStationary(),
      location: [0, 0],
      jumpAngle: 0.0,
      shipIsInHyperspace: false
    };
  }

  componentDidMount() {
  	
  	this.setState({location: this.props.location});
  	this.setState({jumpAngle: this.props.shipJumpAngle});
  	this.setState({shipIsInHyperspace: false});
  	console.log("Stationary Ship has mounted: ", this.props);


  }

  componentWillReceiveProps(newProps) {
  	

  	if(!this.state.shipIsInHyperspace && this.props.shipJumpAngle !== newProps.shipJumpAngle) {

  		console.log("\nStationary Ship is updating\n");

  		this.setState({jumpAngle: newProps.shipJumpAngle});
  		this.setState({location: newProps.location});
  	}


  }

  componentWillUnmount() {
  	console.log("Stationary Ship will Unmount");


  	$(".shipIconStationary").remove();

		// const stationaryShipElements = document.getElementsByClassName("shipIconStationary");
		// console.log("stationaryShipElements: ", stationaryShipElements);
		// const StationaryShipElementFirst = stationaryShipElements[0];

		// // StationaryShipElementFirst.remove();

		// const map = this.props.map;

		// map.removeLayer(this.refs.stationaryShip.leafletElement);



		this.setState({shipIsInHyperspace: true});
  }


  onClick(e) {

  	console.log("Stationary Ship has been clicked");

  }


  render() {

  	const MarkerStyles = (!this.state.shipIsInHyperspace)? {} : {display: 'none'};

  	return (
  		<div  id={uuidv4()} style={MarkerStyles} className="stationary-ship-container">
				
	  	</div>
  	)
  }
}


// <RotatedMarker
//   key={uuidv4()}
//   position={this.state.location}
//   rotationAngle={this.state.jumpAngle}
//   rotationOrigin={'center'} 
//   zIndexOffset={2}
//   icon={this.state.shipIcon}
//   onClick={(e) => this.onClick(e)}
//   ref="stationaryShip"
// >
// </RotatedMarker>





function getShipIconStationary() {
	return new L.Icon({
		// iconUrl: require('../../images/icons/falcon-icons/falcon-tiny.png'),
		iconUrl: require('../../images/icons/falcon-icons/falcon-color-small.png'),
		// shadowUrl: require('../../images/icons/falcon-icons/falcon-black-tiny.png'),

		// shadowUrl: require('../../images/icons/falcon-icons/falcon-tiny.jpg'),
		// iconSize: [30, 30],
		iconSize: [40, 40],
		// iconAnchor: [15, 15],
		iconAnchor: [20, 20],

		// iconSize:     [60, 60], // size of the icon
		// shadowSize:   [50, 64], // size of the shadow
		// iconAnchor:   [30, 80], // point of the icon which will correspond to marker's location

		// shadowAnchor: [4, 62],  // the same for the shadow
		// popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
		className: 'shipIconStationary'
	});
}


// const mapStateToProps = (state = {}) => {
//   return Object.assign({}, state);
// };

// export default connect(mapStateToProps)(StationaryShip);

export default StationaryShip;