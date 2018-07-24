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
import '../../css/main.css';


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
      endTime: null,
      pausingHyperspaceJump: false,
      currentShipJumpAngle: 0.0
    };
  }

  componentDidMount() {
  	this.setState({location: this.props.location});
  }


  componentWillReceiveProps(newProps) {
  	if(newProps.hyperspacePathCollections.length > 0 && !this.state.inHyperspace && !this.props.updateHyperspaceNavigation) {
  		// console.log("Hyperspace Path Collections Found: ", newProps.hyperspacePathCollections);
  		// console.log("Leaflet: ", L);

			const map = this.props.map;
			const shipPointIcon = getTargetIcon(true);
			const shipIconDestination = getShipIcon(true);
  		const FirstPath = newProps.hyperspacePathCollections[0];
  		const startCoordinates = FirstPath.jumpCoordinates[0];

  		console.log("\n\nshipIcon: ", shipPointIcon);
			console.log("map: ", map)
  		console.log("FirstPath: ", FirstPath);





  	// 	const destinations = getMarkerDestinationsArray(this.state.speed + 0.41, FirstPath.jumpCoordinates, FirstPath.jumpDistances);
  	// 	let previousCoordinates = startCoordinates;
  	// 	const MovingShipMarkerPrecise = movingMarkerGenerator(previousCoordinates, {
		 //    destinations: destinations,
		 //    // icon: shipIconDestination
			// });
			// MovingShipMarkerPrecise.addTo(map);

			// console.log("MovingShipMarkerPrecise: ", MovingShipMarkerPrecise);

			// const startTimePrecise = Date.now();
  	// 	const startTimePreciseLocal = moment.utc(startTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
  	// 	const startTimePreciseGMT = moment.utc(startTimePrecise).format("DD/MM/YYYY HH:mm:ss");
  	// 	console.log(`Ship has jumped at ${startTimePreciseLocal} local time. ${startTimePreciseGMT} GMT.`);

  	// 	MovingShipMarkerPrecise.on('start', startData => {
  	// 		console.log("Start Data: ", startData);

  	// 	});

			// MovingShipMarkerPrecise.on('destination', destination => {

			// 	const destinationTimePrecise = Date.now();

			// 	// console.log("destination: ", destination);
		 //    const destinationLat = destination.latLng[0];
		 //    const destinationLng = destination.latLng[1];



		 //    // const destinationLat = (destination.nextLatLng)? destination.nextLatLng.lat : destination.latLng[0];
		 //    // const destinationLng = (destination.nextLatLng)? destination.nextLatLng.lng : destination.latLng[1];

		 //    const NodeFound = findNodeByLatLng(destinationLat, destinationLng, FirstPath.nodes);
		 //    if(NodeFound.isFound) {
		 //    	const NodeData = NodeFound.data;
					
		 //  		const destinationTimePreciseLocal = moment.utc(destinationTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
		 //  		const destinationTimePreciseGMT = moment.utc(destinationTimePrecise).format("DD/MM/YYYY HH:mm:ss");
		 //  		// console.log("\n\nShip destination time Local: ", destinationTimePreciseLocal);	
		 //  		console.log(`\n\nShip has arrived at ${NodeData.system} at ${destinationTimePreciseLocal}`);
		 //    }
		 //    previousCoordinates = destination.latLng;
			// });
			// MovingShipMarkerPrecise.on('destinationsdrained', destinationFinal => {
	  // 		const endTimePrecise = Date.now();
			// 	const sourceStartTarget = destinationFinal.sourceTarget;
			// 	const startTarget = destinationFinal.target;
			// 	const sourceStartTargetLatitude = sourceStartTarget.startLatLng.lat;
			// 	const targetStartLatitude = startTarget.startLatLng.lat;
			// 	const sourceLatitudesMatch = (sourceStartTargetLatitude === targetStartLatitude)? true : false;
			// 	const sourceEndTargetLongitude = sourceStartTarget.startLatLng.lng;
			// 	const targetEndLongitude = startTarget.startLatLng.lng;
			// 	const sourceLongitudesMatch = (sourceEndTargetLongitude === targetEndLongitude)? true : false;
			// 	const sourceAndTargetMatches = (sourceLatitudesMatch && sourceLongitudesMatch)? true : false;
			// 	const sourceTargetFinal = destinationFinal.sourceTarget;
			// 	const targetFinal = destinationFinal.target;
			// 	const sourceTargetFinalLatitude = sourceTargetFinal.nextLatLng.lat;
			// 	const targetFinalLatitude = targetFinal.nextLatLng.lat;
			// 	const sourceTargetFinalLongitude = sourceTargetFinal.nextLatLng.lng;
			// 	const targetFinalLongitude = targetFinal.nextLatLng.lng;
			// 	const finalLatitudesMatch = (sourceTargetFinalLatitude === targetFinalLatitude)? true : false;
			// 	const finalLongitudesMatch = (sourceTargetFinalLongitude === targetFinalLongitude)? true : false;
			// 	const finalSourceAndTargetMatches = (finalLatitudesMatch && finalLongitudesMatch)? true : false;
		 //    const NodeFound = findNodeByLatLng(targetFinalLatitude, targetFinalLongitude, FirstPath.nodes);

		 //    if(finalSourceAndTargetMatches && sourceAndTargetMatches && NodeFound.isFound) {
		 //    	console.log("\n\nα --> Jump Successful --> β");
		 //    	const travelTime = endTimePrecise - startTimePrecise;
	  // 			const travelTimeSeconds = (travelTime / 1000.0);
	  // 			const travelTimeMinutes = (travelTimeSeconds / 60.0);
	  // 			const travelTimeHours = (travelTimeSeconds / 3600.0);
	  // 			const travelTimeHoursInt = parseInt(travelTimeHours);
			// 		const hoursDisplayed = (parseInt(travelTimeHours) > 0)? parseInt(travelTimeHours) + ' hour(s), ' : '';
			// 		const minutesDisplaned = (parseInt(travelTimeMinutes) > 0)? parseInt(travelTimeMinutes) % 60 + ' minute(s), ' : '';
	  // 			const endTimePreciseLocal = moment.utc(endTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
	  // 			const endTimePreciseGMT = moment.utc(endTimePrecise).format("DD/MM/YYYY HH:mm:ss");
			// 		const distanceTraveled = FirstPath.jumpDistances.slice().reduce(getSum, 0);
			// 		const averageSpeed =  distanceTraveled / travelTimeSeconds;
		 //    	const NodeData = NodeFound.data;
			// 		const destinationTimePrecise = Date.now();
		 //  		const destinationTimePreciseLocal = moment.utc(destinationTimePrecise).local().format("DD/MM/YYYY HH:mm:ss");
		 //  		const destinationTimePreciseGMT = moment.utc(destinationTimePrecise).format("DD/MM/YYYY HH:mm:ss");
		 //  		console.log(`Ship has arrived at ${NodeData.system} at ${destinationTimePreciseLocal}`);
		 //  		console.log(`Travel Time: ${hoursDisplayed} ${minutesDisplaned} ${travelTimeSeconds % 60} second(s).`);
		 //  		console.log(`Distance Traveled:  ${distanceTraveled} parsecs.`);
		 //  		console.log(`Average Speed: ${averageSpeed} parsecs per second.`);
		 //    } else {
		 //    	console.log("Node was not found: ", NodeFound);
		 //    }
			// });

			// MovingShipMarkerPrecise.on('click', e => {
			// 	console.log("Precise Marker clicked while in motion: ", e);
			// });






			const innerNodesArray = getInternalNodes(FirstPath.start, FirstPath.end, FirstPath.nodes)

			const innerNodeStationIndexes = getArrayOfNodeIndexes(FirstPath.jumpCoordinates, innerNodesArray);

			const internalCoordinates = FirstPath.jumpCoordinates.slice();
			internalCoordinates.shift();
			internalCoordinates.pop();

			// const internalCoordinatesIndexes = getArrayOfNodeIndexes(FirstPath.jumpCoordinates, internalCoordinates);

			let internalCoordinatesIndexes = [];
			for(let i=1; i < FirstPath.jumpCoordinates.length - 1; i++) {
				internalCoordinatesIndexes.push(i);
			}



  		const durations = getMarkerDurationsArray(this.state.speed, FirstPath.jumpCoordinates, FirstPath.jumpDistances);
  		const shipIcon = getShipIcon(true);
  		const shipTarget = getTargetIcon(true);
  		const MovingShipMarker = leafletMovingMarker(FirstPath.jumpCoordinates, durations, {
  			autostart: true,
  			icon: shipIcon
  		});

  		const startLat = FirstPath.jumpCoordinates[0][0];
  		const startLng = FirstPath.jumpCoordinates[0][1];
  		// MovingShipMarker.setRotationOrigin(startLat, startLng);
  		MovingShipMarker.setRotationAngle(FirstPath.startingJumpAngle);

			// for(let nodeStation of innerNodeStationIndexes) {
			// 	// MovingShipMarker.addStation(nodeStation, 10.0 * 1000.0);
			// 	MovingShipMarker.addStation(nodeStation, 100.0);
			// }


  		// let previousShipLatitude = startLat;
  		// let previousShipLongitude = startLng;
  		// let previousShipAngle = FirstPath.startingJumpAngle;


  		// const nodeCheck = () => { 
  		// 	return setInterval(() => {

  		// 	// const pausedStatus = MovingShipMarker.isPaused();
  		// 	const CurrentLatLng = MovingShipMarker.getLatLng();


  		// 	// const runStatus = MovingShipMarker.isRunning();

  		// 	// console.log("Paused Staus: ", pausedStatus);

  		// 	const pausedStatus = (previousShipLatitude === CurrentLatLng.lat && previousShipLongitude === CurrentLatLng.lng)? true : false;

  		// 	if(pausedStatus && !this.state.pausingHyperspaceJump) {
  		// 		const PausedLatLng = MovingShipMarker.getLatLng();
  		// 		console.log("Ship is paused: ", PausedLatLng);
  		// 		const NodeFoundPaused = findNodeByLatLng(PausedLatLng.lat, PausedLatLng.lng, innerNodesArray);
  		// 		if(NodeFoundPaused.isFound) {
  		// 			console.log("\nShip has passed: ", NodeFoundPaused.data.system);
  		// 		}
  		// 		this.setState({pausingHyperspaceJump: true});
  		// 	} else if(!pausedStatus && this.state.pausingHyperspaceJump){
  		// 		console.log("Ship is moving. Current lat and lng: ", CurrentLatLng);
  		// 		if(this.state.pausingHyperspaceJump) {
  		// 			this.setState({pausingHyperspaceJump: false});
  		// 		}
  		// 	}

				// previousShipLatitude = CurrentLatLng.lat;
				// previousShipLongitude = CurrentLatLng.lng;
			

  		// }, 50)};

  		// let nodeCheckInterval = nodeCheck();



			for(let coordinateIndex=1; coordinateIndex < FirstPath.jumpCoordinates.length - 1; coordinateIndex++) {
				const currentCoordinate = FirstPath.jumpCoordinates[coordinateIndex];
				const CoordinateNodeFound = findNodeByLatLng(currentCoordinate[0], currentCoordinate[1], innerNodesArray);
				if(CoordinateNodeFound && CoordinateNodeFound.isFound) {
					console.log("\nCoordinate is Node: ", CoordinateNodeFound.data.system);
					MovingShipMarker.addStation(coordinateIndex, 250.0);
				} else {
					MovingShipMarker.addStation(coordinateIndex, 20.0);
				}				
			}

  		let previousShipCoordinateLatitude = startLat;
  		let previousShipCoordinateLongitude = startLng;
  		let previousShipCoordinateAngle = FirstPath.startingJumpAngle;
  		const startingShipJumpAngle = parseFloat(FirstPath.startingJumpAngle);
  		this.setState({currentShipJumpAngle: startingShipJumpAngle});


  		const coordinateCheck = () => { 
  			return setInterval(() => {


  			// const pausedStatus = MovingShipMarker.isPaused();
  			const CurrentLatLng = MovingShipMarker.getLatLng();


  			// const runStatus = MovingShipMarker.isRunning();

  			// console.log("Paused Staus: ", pausedStatus);

  			const pausedStatus = (previousShipCoordinateLatitude === CurrentLatLng.lat && previousShipCoordinateLongitude === CurrentLatLng.lng)? true : false;

  			if(pausedStatus && !this.state.pausingHyperspaceJump) {
  				const PausedLatLng = MovingShipMarker.getLatLng();
  				// console.log("Ship is paused: ", PausedLatLng);
  				
  				// const shipAngleAdjustmentValue = FirstPath.pointJumpCorrectionAngles[currentAngleFixValue];

					const CoordinateFound = findCoordinateByLatLng(CurrentLatLng.lat, CurrentLatLng.lng, FirstPath.jumpCoordinates);
					const NodeFound = findNodeByLatLng(CurrentLatLng.lat, CurrentLatLng.lng, innerNodesArray);
  				if(CoordinateFound.isFound || NodeFound.isFound) {
  					console.log("\nMicro pause at Coordinate: ", CoordinateFound.data);

	  				console.log("CurrentLatLng: ", CurrentLatLng);
	  				const coordinateLat = CoordinateFound.data[0];
	  				const coordinateLng = CoordinateFound.data[1];

	  				if(NodeFound.isFound) {
							console.log("Ship has passed: ", NodeFound.data.system);
						}


						const currentJumpCoordinatesIndex = findCoordinateIndexLatLng(CurrentLatLng.lat, CurrentLatLng.lng, FirstPath.jumpCoordinates);

	  				// const currentJumpCoordinatesIndex = FirstPath.jumpCoordinates.indexOf([CurrentLatLng.lat, CurrentLatLng.lng]);

  					const jumpAngleCorrection = FirstPath.pointJumpCorrectionAngles[currentJumpCoordinatesIndex - 1];

  					const shipJumpAngle = FirstPath.betterShipAngles[currentJumpCoordinatesIndex];

  					// const newShipJumpAngle =  previousShipCoordinateAngle + jumpAngleCorrection;
  					// previousShipCoordinateAngle = newShipJumpAngle;

  					const jumpAngleChange = (jumpAngleCorrection)? jumpAngleCorrection : 0.00;
  					const jumpAngleToAdd = (jumpAngleChange > 1.0)? jumpAngleChange : 0.00;
  					const newJumpAngle = parseFloat(this.state.currentShipJumpAngle + jumpAngleToAdd);

  					MovingShipMarker.setRotationAngle(shipJumpAngle);

  					console.log("this.state.currentShipJumpAngle");

  					// console.log("Jump angle to change by: ", jumpAngleCorrection);
  					console.log("New Ship Jump Angle: ", shipJumpAngle);
  					this.setState({pausingHyperspaceJump: true});

  					this.setState({currentShipJumpAngle: shipJumpAngle});

  				}


  				// currentAngleFixIndex += 1;
  				// this.setState({pausingHyperspaceJump: true});
  			} else if(!pausedStatus && this.state.pausingHyperspaceJump){
  				// console.log("Ship is moving. Current lat and lng: ", CurrentLatLng);
  				if(this.state.pausingHyperspaceJump) {
  					this.setState({pausingHyperspaceJump: false});
  				}
  			}

				previousShipCoordinateLatitude = CurrentLatLng.lat;
				previousShipCoordinateLongitude = CurrentLatLng.lng;
			

  		}, 5)};


  		let coordinateCheckInterval = coordinateCheck();


  		MovingShipMarker.addTo(map);
  		console.log("MovingShipMarker: ", MovingShipMarker);
  		
  		const startTime = Date.now();
  		const startTimeLocal = moment.utc(startTime).local().format("DD/MM/YYYY HH:mm:ss");
  		const startTimeGMT = moment.utc(startTime).format("DD/MM/YYYY HH:mm:ss");
  		console.log("\nShip start time Local: ", startTimeLocal);
  		console.log("Ship start time GMT: ", startTimeGMT);

  		MovingShipMarker.on('start', () => {
  			console.log("\nShip start time: ", Date.now());
  			const StartLatLng = MovingShipMarker.getLatLng();

	  		previousShipLatitude = StartLatLng.lat;
	  		previousShipLongitude = StartLatLng.lng;
  		});

			MovingShipMarker.on('click', e => {
				console.log("Falcon clicked at: ", e.latlng);
				const galacticX = getGalacticXFromLongitude(e.latlng.lng);
				const galacticY = getGalacticYFromLatitude(e.latlng.lat);
				console.log(`Falcon at X: ${galacticX} and Y: ${galacticY}.`)
			});

  		MovingShipMarker.on('end', () => {
	  		const endTime = Date.now();

	  		// clearInterval(nodeCheckInterval);
	  		clearInterval(coordinateCheckInterval);


	  		const CurrentLatLng = MovingShipMarker.getLatLng();

	  		console.log("\nCurrent Lat Lng: ", CurrentLatLng);

				const currentShipLatitude = MovingShipMarker._latlng.lat;
				const currentShipLongitude = MovingShipMarker._latlng.lng;

				const shipDestinationCoordinates = MovingShipMarker._latlngs;
				const targetDestinationCoordinates = shipDestinationCoordinates[ shipDestinationCoordinates.length - 1];

				const targetShipLatitude = targetDestinationCoordinates.lat;
				const targetShipLongitude = targetDestinationCoordinates.lng;

				const finalLatitudesMatch = (currentShipLatitude === targetShipLatitude)? true : false;
				const finalLongitudesMatch = (currentShipLongitude === targetShipLongitude)? true : false;
				const finalCurrentAndTargetMatches = (finalLatitudesMatch && finalLongitudesMatch)? true : false;

	  		const NodeFound = findNodeByLatLng(currentShipLatitude, currentShipLongitude, FirstPath.nodes);

	  		if(NodeFound.isFound) {
	  			const NodeData = NodeFound.data;
	  			const travelTime = endTime - startTime;

	  			const travelTimeSeconds = (travelTime / 1000.0);
	  			const travelTimeMinutes = (travelTimeSeconds / 60.0);
	  			const travelTimeHours = (travelTimeSeconds / 3600.0);
	  			const travelTimeHoursInt = parseInt(travelTimeHours);
					const hoursDisplayed = (parseInt(travelTimeHours) > 0)? parseInt(travelTimeHours) + ' hour(s), ' : '';
					const minutesDisplayed = (parseInt(travelTimeMinutes) > 0)? parseInt(travelTimeMinutes) % 60 + ' minute(s), ' : '';

					const distanceTraveled = FirstPath.jumpDistances.slice().reduce(getSum, 0);
					const averageSpeed =  distanceTraveled / travelTimeSeconds;

	  			const endTimeLocal = moment.utc(endTime).local().format("DD/MM/YYYY HH:mm:ss");
	  			const endTimeGMT = moment.utc(endTime).format("DD/MM/YYYY HH:mm:ss");
	  			// console.log("Ship end time Local: ", endTimeLocal);
	  			// console.log("Ship end time GMT: ", endTimeGMT);
	  			console.log("\n\nTravel Time: ", travelTime);



		  		console.log(`Ship has arrived at ${NodeData.system} at ${endTime}`);
		  		console.log(`Travel Time: ${hoursDisplayed} ${minutesDisplayed} ${travelTimeSeconds % 60} second(s).`);
		  		console.log(`Distance Traveled:  ${distanceTraveled} parsecs.`);
		  		console.log(`Average Speed: ${averageSpeed} parsecs per second.`);

	  		}

	  		this.setState({location: [currentShipLatitude, currentShipLongitude]});

  		});

  		MovingShipMarker.start();




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
		const shipIcon = getShipIcon(true);

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



function getInternalNodes(startNodeId, endNodeId, nodes) {
	return nodes.filter(n => {
		return (n.nodeId !== startNodeId && n.nodeId !== endNodeId);
	});
};

function getArrayOfNodeIndexes(jumpCoordinates, innerNodes) {
	return innerNodes.map(n => {
		return jumpCoordinates.findIndex(e => {
			return (e[0] === n.lat && e[1] === n.lng);
		});
	});
};


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


function findCoordinateByLatLng(lat, lng, coordinatesArray) {
  const CoordinateFound = _.find(coordinatesArray, (n) => { return n[0] === lat && n[1] === lng });
  if(CoordinateFound) {
    return {
    	isFound: true,
    	data: CoordinateFound
    };
  } else {
    return {
    	isFound: false,
    	data: {}
    };
  }
};


function findCoordinateIndexLatLng(lat, lng, coordinatesArray) {
  return _.findIndex(coordinatesArray, (n) => { return n[0] === lat && n[1] === lng });
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



function getShipIcon(visibility) {

	// return L.divIcon({
 //    className: "shipPicture",

	// 	iconUrl: require('../../images/icons/falcon-icons/falcon-color.png'),
 //    iconRetinaUrl: require('../../images/icons/falcon-icons/falcon-color.png'),

 //    iconSize: new L.Point(30, 30),
 //    iconAnchor: new L.Point(20, 18),
 //  });

 	const shipIconClasses = (visibility)? 'shipIcon' : 'shipIcon shipIconInvisible';

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
		className: shipIconClasses
	});

}





function getTargetIcon(visibility) {

	// return L.divIcon({
 //    className: "shipPicture",

	// 	iconUrl: require('../../images/icons/falcon-icons/falcon-color.png'),
 //    iconRetinaUrl: require('../../images/icons/falcon-icons/falcon-color.png'),

 //    iconSize: new L.Point(30, 30),
 //    iconAnchor: new L.Point(20, 18),
 //  });
	const targetIconClasses = (visibility)? 'shipTargetIcon' : 'shipIcon shipIconInvisible';

	return new L.Icon({
		iconUrl: require('../../images/icons/targets/green-bullseye.jpg'),
		// shadowUrl: require('../../images/icons/falcon-icons/falcon-black-tiny.png'),

		// shadowUrl: require('../../images/icons/falcon-icons/falcon-tiny.jpg'),
		iconSize: [30, 30],
		iconAnchor: [15, 15],

		// iconSize:     [60, 60], // size of the icon
		// shadowSize:   [50, 64], // size of the shadow
		// iconAnchor:   [30, 80], // point of the icon which will correspond to marker's location

		// shadowAnchor: [4, 62],  // the same for the shadow
		// popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
		className: targetIconClasses
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


function getGalacticYFromLatitude(latitude) {
  return  (-3.07e-19*(latitude**12)) + (-1.823e-18*(latitude**11)) + (4.871543e-15*(latitude**10)) + (4.1565807e-14*(latitude**9)) + (-2.900986202e-11 * (latitude**8)) + (-1.40444283864e-10*(latitude**7)) + (7.9614373223054e-8*(latitude**6)) + (7.32976568692443e-7*(latitude**5)) + (-0.00009825374539548058*(latitude**4)) + (0.005511093818675318*(latitude**3)) + (0.04346753629461727 * (latitude**2)) + (111.30155374684914 * latitude);
}

function getGalacticXFromLongitude(longitude) {
  return (111.3194866138503 * longitude);
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