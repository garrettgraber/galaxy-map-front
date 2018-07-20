import React from 'react';
import { connect } from 'react-redux';
import { Circle, Marker, CircleMarker } from 'react-leaflet';
import { If, Then, Else } from 'react-if';
import L from 'leaflet';

import 'rotate-icon';

import 'leaflet-rotatedmarker';


import width from 'text-width';
import _ from 'lodash';
import Geohash from 'latlon-geohash';
import moment from 'moment';
// import 'leaflet-moving-marker';
// import LeafletMovingMarker from 'leaflet_moving_marker';



import uuidv4 from 'uuid/v4';


import falconImage from '../../images/icons/falcon-icons/falcon-color.png';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import 'leaflet-rotatedmarker';

// import 'leaflet_moving_marker';
// import 'leaflet.markercluster';
// import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';


import { leafletMovingMarker } from '../../movingMarkerNinja/movingMarker.js';
import { movingMarkerGenerator } from '../../leafletMarkerDeus/movingMarker.js';




const falconTiny = '../../images/icons/falcon-icons/falcon-tiny.png';
const falconMedium = '../../images/icons/falcon-icons/falcon-medium.png';


class Ship extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StarShipComponents: [],
      location: [0, 0],
      inHyperspace: false,
      speed: 10.00,
      name: 'Millennium Falcon',
      startTime: null,
      endTime: null
    };
  }

  componentDidMount() {
  	this.setState({location: this.props.location});
  }


  componentWillReceiveProps(newProps) {
  	if(newProps.hyperspacePathCollections.length > 0 && !this.state.inHyperspace) {
  		// console.log("Hyperspace Path Collections Found: ", newProps.hyperspacePathCollections);
  		// console.log("Leaflet: ", L);

			const map = this.props.map;
			const shipIcon = getShipIcon();
  		const FirstPath = newProps.hyperspacePathCollections[0];
  		const startCoordinates = FirstPath.jumpCoordinates[0];
  		const destinations = getMarkerDestinationsArray(this.state.speed, FirstPath.jumpCoordinates, FirstPath.jumpDistances);

  		console.log("\n\nshipIcon: ", shipIcon);
			console.log("map: ", map)
  		console.log("FirstPath: ", FirstPath);
  		console.log("destinations: ", destinations[0]);

  		let previousCoordinates = [0, 0];
  		const MovingShipMarkerPrecise = movingMarkerGenerator(previousCoordinates, {
		    destinations: destinations,
		    icon: shipIcon
			});
			MovingShipMarkerPrecise.addTo(map);

			console.log("MovingShipMarkerPrecise: ", MovingShipMarkerPrecise);

			const startTimePrecise = Date.now();
  		const startTimePreciseLocal = moment.utc(startTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
  		const startTimePreciseGMT = moment.utc(startTimePrecise).format("DD/MM/YYYY HH:mm:ss");
  		console.log(`Ship has jumped at ${startTimePreciseLocal} local time. ${startTimePreciseGMT} GMT.`);

			MovingShipMarkerPrecise.on('destination', destination => {
				console.log("destination: ", destination);
		    const destinationLat = destination.latLng[0];
		    const destinationLng = destination.latLng[1];



		    // const destinationLat = (destination.nextLatLng)? destination.nextLatLng.lat : destination.latLng[0];
		    // const destinationLng = (destination.nextLatLng)? destination.nextLatLng.lng : destination.latLng[1];

		    const NodeFound = findNodeByLatLng(destinationLat, destinationLng, FirstPath.nodes);
		    if(NodeFound.isFound) {
		    	const NodeData = NodeFound.data;
					const destinationTimePrecise = Date.now();
		  		const destinationTimePreciseLocal = moment.utc(destinationTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
		  		const destinationTimePreciseGMT = moment.utc(destinationTimePrecise).format("DD/MM/YYYY HH:mm:ss");
		  		console.log("\n\nShip destination time Local: ", destinationTimePreciseLocal);
		  		console.log(`Ship has arrived at ${NodeData.system} at ${destinationTimePreciseLocal}`);
		    }
		    previousCoordinates = destination.latLng;
			});
			MovingShipMarkerPrecise.on('destinationsdrained', destinationFinal => {
	  		const endTimePrecise = Date.now();
				const sourceStartTarget = destinationFinal.sourceTarget;
				const startTarget = destinationFinal.target;
				const sourceStartTargetLatitude = sourceStartTarget.startLatLng.lat;
				const targetStartLatitude = startTarget.startLatLng.lat;
				const sourceLatitudesMatch = (sourceStartTargetLatitude === targetStartLatitude)? true : false;
				const sourceEndTargetLongitude = sourceStartTarget.startLatLng.lng;
				const targetEndLongitude = startTarget.startLatLng.lng;
				const sourceLongitudesMatch = (sourceEndTargetLongitude === targetEndLongitude)? true : false;
				const sourceAndTargetMatches = (sourceLatitudesMatch && sourceLongitudesMatch)? true : false;
				const sourceTargetFinal = destinationFinal.sourceTarget;
				const targetFinal = destinationFinal.target;
				const sourceTargetFinalLatitude = sourceTargetFinal.nextLatLng.lat;
				const targetFinalLatitude = targetFinal.nextLatLng.lat;
				const sourceTargetFinalLongitude = sourceTargetFinal.nextLatLng.lng;
				const targetFinalLongitude = targetFinal.nextLatLng.lng;
				const finalLatitudesMatch = (sourceTargetFinalLatitude === targetFinalLatitude)? true : false;
				const finalLongitudesMatch = (sourceTargetFinalLongitude === targetFinalLongitude)? true : false;
				const finalSourceAndTargetMatches = (finalLatitudesMatch && finalLongitudesMatch)? true : false;
		    const NodeFound = findNodeByLatLng(targetFinalLatitude, targetFinalLongitude, FirstPath.nodes);

		    if(finalSourceAndTargetMatches && sourceAndTargetMatches && NodeFound.isFound) {
		    	console.log("\n\nα --> Jump Successful --> β");
		    	const travelTime = endTimePrecise - startTimePrecise;
	  			const travelTimeSeconds = (travelTime / 1000.0);
	  			const travelTimeMinutes = (travelTimeSeconds / 60.0);
	  			const travelTimeHours = (travelTimeSeconds / 3600.0);
	  			const travelTimeHoursInt = parseInt(travelTimeHours);
					const hoursDisplayed = (parseInt(travelTimeHours) > 0)? parseInt(travelTimeHours) + ' hour(s), ' : '';
					const minutesDisplaned = (parseInt(travelTimeMinutes) > 0)? parseInt(travelTimeMinutes) % 60 + ' minute(s), ' : '';
	  			const endTimePreciseLocal = moment.utc(endTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
	  			const endTimePreciseGMT = moment.utc(endTimePrecise).format("DD/MM/YYYY HH:mm:ss");
					const distanceTraveled = FirstPath.jumpDistances.slice().reduce(getSum, 0);
					const averageSpeed =  distanceTraveled / travelTimeSeconds;
		    	const NodeData = NodeFound.data;
					const destinationTimePrecise = Date.now();
		  		const destinationTimePreciseLocal = moment.utc(destinationTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
		  		const destinationTimePreciseGMT = moment.utc(destinationTimePrecise).format("DD/MM/YYYY HH:mm:ss");
		  		console.log(`Ship has arrived at ${NodeData.system} at ${destinationTimePreciseLocal}`);
		  		console.log(`Travel Time: ${hoursDisplayed} ${minutesDisplaned} ${travelTimeSeconds % 60} second(s).`);
		  		console.log(`Distance Traveled:  ${distanceTraveled} parsecs.`);
		  		console.log(`Average Speed: ${averageSpeed} parsecs per second.`);
		    } else {
		    	console.log("Node was not found: ", NodeFound);
		    }
			});

			MovingShipMarkerPrecise.on('click', e => {
				console.log("Falcon clicked while in motion: ", e);
			});

			// console.log("destinations: ", destinations.length);



  		// const durations = getMarkerDurationsArray(this.state.speed, FirstPath.jumpCoordinates, FirstPath.jumpDistances);
  		// const MovingShipMarker = leafletMovingMarker(FirstPath.jumpCoordinates, durations, {
  		// 	autostart: true,
  		// 	icon: shipIcon
  		// });
  		// MovingShipMarker.addTo(map);
  		// console.log("MovingShipMarker: ", MovingShipMarker);
  		
  		// const startTime = Date.now();
  		// const startTimeLocal = moment.utc(startTime).local().format("DD/MM/YYYY HH:mm:ss");
  		// const startTimeGMT = moment.utc(startTime).format("DD/MM/YYYY HH:mm:ss");
  		// console.log("Ship start time Local: ", startTimeLocal);
  		// console.log("Ship start time GMT: ", startTimeGMT);

  		// MovingShipMarker.on('start', () => {
  		// 	console.log("Ship start time: ", Date.now());
  		// });

  		// MovingShipMarker.on('end', () => {
	  	// 	const endTime = Date.now();
  		// 	const travelTime = endTime - startTime;
  		// 	const endTimeLocal = moment.utc(endTime).local().format("DD/MM/YYYY HH:mm:ss");
  		// 	const endTimeGMT = moment.utc(endTime).format("DD/MM/YYYY HH:mm:ss");
  		// 	console.log("Ship end time Local: ", endTimeLocal);
  		// 	console.log("Ship end time GMT: ", endTimeGMT);
  		// 	console.log("Travel Time: ", travelTime);
  		// });

  		// this.state.StarShipComponents.push(MovingShipMarker);

  		this.setState({inHyperspace: true});

  	}

  }

  onClick(e) {
  	console.log("Ship Clicked: ", this.state.name);
  }

  render() {
  	const zIndex = 282;
    const StarShipsToRender = renderComponentsOrNull(this.state.StarShipComponents);
    // console.log("Total Star Components Rendering: ", (this.state.StarMapComponents)? this.state.StarMapComponents.length : null);
		const shipIcon = getShipIcon();

  	return (
  		<div style={ {} }>

  			<If condition={ this.state.inHyperspace }>
          <Then>
          	{ StarShipsToRender }

          </Then>
          <Else>


          	<div style={ {} }>

	          	

	          	<Marker key={uuidv4()} position={this.state.location} zIndexOffset={2} icon={shipIcon} onClick={(e) => this.onClick(e)}>
			          
			        </Marker>

		        </div>


          </Else>
        </If>


  		</div>
  	)
  }

}




// <CircleMarker center={this.state.location} radius={2} color={'gold'} fillColor={'fillColor'} fillOpacity={1.0} onClick={(e) => this.onClick(e)}></CircleMarker>



function findNodeByLatLng(lat, lng, nodesArray) {
  const NodeFound = _.find(nodesArray, (n) => { return n.lat === lat && n.lng === lng });
  if(NodeFound) {
    return {
    	isFound: true,
    	data: NodeFound
    };
  } else {
    return {
    	isFound: false,
    	data: {}
    };
  }
};


function getSum(total, num) {
    return total + num;
}

function getMarkerDestinationsArray(speed, coordinatesArray, distanceBetweenPointsArray) {
	let destinationsArray = [];
	for(let i=1; i < coordinatesArray.length; i++) {
		const coordinate = coordinatesArray[i];
		const distanceBetweenPoints = distanceBetweenPointsArray[i];
		const duration = (distanceBetweenPoints / speed) * 1000.0;
		destinationsArray.push({
			latLng: coordinate,
			duration: duration
		});
	}
	return destinationsArray;
};


function getMarkerDurationsArray(speed, coordinatesArray, distanceBetweenPointsArray) {
	let durationsArray = [];
	for(let i=1; i < coordinatesArray.length; i++) {
		const coordinate = coordinatesArray[i];
		const distanceBetweenPoints = distanceBetweenPointsArray[i];
		const duration = (distanceBetweenPoints / speed) * 1000.0;
		durationsArray.push(duration);
	}
	return durationsArray;
};



const RotatingIcon = L.DivIcon.extend({
    createIcon: function() {
        // outerDiv.style.transform is updated by Leaflet
        var outerDiv = document.createElement('div');
        this.div = document.createElement('div');
        outerDiv.appendChild(this.div);
        return outerDiv;
    },
    rotate(deg) {
        this.div.style.transform = 'rotate(' + deg + 'deg)';
    },
});



function getShipIcon() {

	// return L.divIcon({
 //    className: "shipPicture",

	// 	iconUrl: require('../../images/icons/falcon-icons/falcon-color.png'),
 //    iconRetinaUrl: require('../../images/icons/falcon-icons/falcon-color.png'),

 //    iconSize: new L.Point(30, 30),
 //    iconAnchor: new L.Point(20, 18),
 //  });


	return new L.Icon({
		iconUrl: require('../../images/icons/falcon-icons/falcon-tiny.png'),
		// shadowUrl: require('../../images/icons/falcon-icons/falcon-black-tiny.png'),

		// shadowUrl: require('../../images/icons/falcon-icons/falcon-tiny.jpg'),
		iconSize: [30, 30],
		iconAnchor: [15, 15],

		// iconSize:     [60, 60], // size of the icon
		// shadowSize:   [50, 64], // size of the shadow
		// iconAnchor:   [30, 80], // point of the icon which will correspond to marker's location

		// shadowAnchor: [4, 62],  // the same for the shadow
		// popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
		className: 'shipIcon'
	});

}



function getShipLocationIcon() {

	// return L.divIcon({
 //    className: "shipPicture",

	// 	iconUrl: require('../../images/icons/falcon-icons/falcon-color.png'),
 //    iconRetinaUrl: require('../../images/icons/falcon-icons/falcon-color.png'),

 //    iconSize: new L.Point(30, 30),
 //    iconAnchor: new L.Point(20, 18),
 //  });


	return new L.Icon({
		iconUrl: require('../../images/icons/falcon-icons/falcon-medium.png'),
		shadowUrl: require('../../images/icons/falcon-icons/falcon-medium.png'),
		iconSize:     [60, 60], // size of the icon
		// shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [30, 80], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		// popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
	});

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

export default connect(mapStateToProps)(Ship);