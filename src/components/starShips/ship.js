import React from 'react';
import { connect } from 'react-redux';
import { Circle, Marker, CircleMarker } from 'react-leaflet';
import { If, Then, Else } from 'react-if';
import L from 'leaflet';
import distance from 'euclidean-distance';

import 'rotate-icon';

import 'leaflet-rotatedmarker';

import RotatedMarker from 'react-leaflet-rotatedmarker'



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



import {
	nodeAndPointAreEqual
} from '../hyperspaceNavigation/hyperspaceMethods.js';

import {
	addItemToDataStream,
	shipHasExitedHyperspace,
	shipIsInHyperspace,
	zoomToAndPanIsOn,
	zoomToShipIsOff
} from '../../actions/actionCreators.js';


const falconTiny = '../../images/icons/falcon-icons/falcon-tiny.png';
const falconMedium = '../../images/icons/falcon-icons/falcon-medium.png';


class Ship extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StarShipComponents: [],
      location: [0, 0],
      inHyperspace: false,
      // speed: 10.00,
      speed: 20.00,
      name: 'Millennium Falcon',
      startTime: null,
      endTime: null,
      pausingHyperspaceJump: false,
      currentShipJumpAngle: 0.0,
      MovingShipMarker: null
    };
  }

  componentDidMount() {
  	this.setState({location: this.props.location});
  }

  componentWillReceiveProps(newProps) {
  	const hyperspaceDataLoaded = (newProps.hyperspacePathCollections.length > 0)? true : false;
  	const hyperspaceDataNotUpdating = (!newProps.updateHyperspaceNavigation)? true : false;
  	const hyperspaceDataLoadedAndStatic = (hyperspaceDataLoaded && hyperspaceDataNotUpdating);
  	const shipInRealSpace = (!this.state.inHyperspace)? true :  false;
  	const readyToJumpStatus = (hyperspaceDataLoadedAndStatic && shipInRealSpace)? true : false;
  	const shipHasJumpedToHyperspace = newProps.shipHasJumpedToHyperspace;

  	if(readyToJumpStatus) {
  		this.setStationaryShipMarker({
				hyperspacePathCollections : newProps.hyperspacePathCollections,
				StartPoint : newProps.hyperspaceActiveStartPoint,
				StartNode : newProps.hyperspaceActiveStartNode,
  		});
  	}

  	if(readyToJumpStatus && shipHasJumpedToHyperspace) {
  		this.generateMovingShipMarker({
				StartPoint : newProps.hyperspaceActiveStartPoint,
				StartNode : newProps.hyperspaceActiveStartNode,
				EndPoint : newProps.hyperspaceActiveEndPoint,
				EndNode : newProps.hyperspaceActiveEndNode,
				hyperspacePathCollections : newProps.hyperspacePathCollections,
  		});
  	}

  	if(newProps.zoomToShip) {
  		console.log("newProps.zoomToShip has been clicked: ", newProps.zoomToShip);

  		console.log("location: ", this.state.location);
      const newZoom = 6;

  		const map = this.props.map;

  		console.log("this.state.MovingShipMarker: ", this.state.MovingShipMarker);

  		const zoomLocation = this.movingShipMarkerLocation();

			// const FlyBoundsOptions = getFitBounds(this.props.mobileStatus, this.props.hyperspaceNavigationControlsOn);


  		map.flyTo(zoomLocation, newZoom, {animate: false, paddingTopLeft: [500, 0]});
      if(this.props.mobileStatus) {
        this.props.dispatch( zoomToAndPanIsOn() );
      }
      const StartPoint = newProps.hyperspaceActiveStartPoint;
      const EndPoint = newProps.hyperspaceActiveEndPoint;
      const shipLocationString = this.shipLocationNameString(StartPoint, EndPoint);
      const zoomMessage = `Zoomed to the ${this.state.name} at ${shipLocationString}.`;
      this.props.dispatch( addItemToDataStream(zoomMessage) );
			this.props.dispatch( zoomToShipIsOff() );
  	}
  }


  shipLocationNameString(StartPoint, EndPoint) {
  	if(this.state.MovingShipMarker) {
  		const MovingShipMarker = this.state.MovingShipMarker;
  		const CurrentLatLng = MovingShipMarker.getLatLng();
  		const yGalactic = getGalacticYFromLatitude(CurrentLatLng.lat);
  		const xGalactic = getGalacticXFromLongitude(CurrentLatLng.lng);
  		const locationString = `X : ${xGalactic.toFixed(2)} and Y : ${yGalactic.toFixed(2)}`;
  		return locationString;
  	} else {
  		const location = this.state.location;
  		if(pointAndLocationAreSame(StartPoint, location)) {
  			return StartPoint.system
  		} else if(pointAndLocationAreSame(EndPoint, location)) {
  			return EndPoint.system;
  		} else {
  			const lat = location[0];
  			const lng = location[1];
  			const yGalactic = getGalacticYFromLatitude(lat);
	  		const xGalactic = getGalacticXFromLongitude(lng);
	  		const locationString = `X : ${xGalactic.toFixed(2)} and Y : ${yGalactic.toFixed(2)}`;
	  		return locationString;
  		}
  	}
  }

  movingShipMarkerLocation() {
  	if(this.state.MovingShipMarker) {
  		const MovingShipMarker = this.state.MovingShipMarker;
  		const CurrentLatLng = MovingShipMarker.getLatLng();
  		return [CurrentLatLng.lat, CurrentLatLng.lng];
  	} else {
  		return this.state.location;
  	}
  }

  generateMovingShipMarker(Options) {
		const StartPoint = Options.StartPoint;
		const StartNode = Options.StartNode;
		const EndPoint = Options.EndPoint;
		const EndNode = Options.EndNode;
		const hyperspacePathCollections = Options.hyperspacePathCollections;

		const startFreeSpaceJump = !nodeAndPointAreEqual(StartPoint, StartNode);
		const endFreeSpaceJump = !nodeAndPointAreEqual(EndPoint, EndNode);

		const map = this.props.map;

		const FirstPath = modifyShipPathForFreeSpaceJumps({
			StartPoint : StartPoint,
			EndPoint   : EndPoint,
			StartNode  : StartNode,
			EndNode    : EndNode,
			ShipPath   : hyperspacePathCollections[0]
		});


		console.log("map: ", map);
		console.log("FirstPath: ", FirstPath);
		console.log("this.props: ", this.props);

		const innerNodesArray = getInternalNodes(FirstPath.start, FirstPath.end, FirstPath.nodes, startFreeSpaceJump, endFreeSpaceJump);
		const internalCoordinates = FirstPath.jumpCoordinates.slice();
		internalCoordinates.shift();
		internalCoordinates.pop();

		let internalCoordinatesIndexes = [];
		for(let i=1; i < FirstPath.jumpCoordinates.length - 1; i++) {
			internalCoordinatesIndexes.push(i);
		}

		const durations = getMarkerDurationsArray(this.state.speed, FirstPath.jumpCoordinates, FirstPath.jumpDistances, startFreeSpaceJump, endFreeSpaceJump);
		const shipIcon = getShipIcon(true);
		const shipTarget = getTargetIcon(true);
		const MovingShipMarker = leafletMovingMarker(FirstPath.jumpCoordinates, durations, {
			autostart: true,
			icon: shipIcon
		});

		const startLat = FirstPath.jumpCoordinates[0][0];
		const startLng = FirstPath.jumpCoordinates[0][1];
		const startingJumpAngle = FirstPath.shipJumpAngles[0];

		MovingShipMarker.setRotationAngle(startingJumpAngle);

		for(let coordinateIndex=1; coordinateIndex < FirstPath.jumpCoordinates.length - 1; coordinateIndex++) {
			const currentCoordinate = FirstPath.jumpCoordinates[coordinateIndex];
			const CoordinateNodeFound = findNodeByLatLng(currentCoordinate[0], currentCoordinate[1], FirstPath.nodes);
			if(CoordinateNodeFound && CoordinateNodeFound.isFound) {
				console.log("\nCoordinate is Node: ", CoordinateNodeFound.data.system);
				MovingShipMarker.addStation(coordinateIndex, 250.0);
			} else {
				MovingShipMarker.addStation(coordinateIndex, 20.0);
			}				
		}

		
		const startingShipJumpAngle = parseFloat(startingJumpAngle);
		this.setState({currentShipJumpAngle: startingShipJumpAngle});

		let previousShipCoordinateLatitude = startLat;
		let previousShipCoordinateLongitude = startLng;

		const coordinateCheck = (MovingShipMarkerCurrent) => { 
			return setInterval(() => {
			const CurrentLatLng = MovingShipMarkerCurrent.getLatLng();
			const pausedStatus = (previousShipCoordinateLatitude === CurrentLatLng.lat && previousShipCoordinateLongitude === CurrentLatLng.lng)? true : false;

			if(pausedStatus && !this.state.pausingHyperspaceJump) {
				const PausedLatLng = MovingShipMarkerCurrent.getLatLng();

				const CoordinateFound = findCoordinateByLatLng(CurrentLatLng.lat, CurrentLatLng.lng, FirstPath.jumpCoordinates);
				const NodeFound = findNodeByLatLng(CurrentLatLng.lat, CurrentLatLng.lng, FirstPath.nodes);
				if(CoordinateFound.isFound || NodeFound.isFound) {
					console.log("\nMicro pause at Coordinate: ", CoordinateFound.data);
  				console.log("CurrentLatLng: ", CurrentLatLng);
  				const coordinateLat = CoordinateFound.data.lat;
  				const coordinateLng = CoordinateFound.data.lng;

  				if(NodeFound.isFound) {
						console.log("Ship has passed: ", NodeFound.data);
						const shipNodeText = `The ${this.state.name} has passed ${NodeFound.data.system}.`;

						this.props.dispatch( addItemToDataStream(shipNodeText) );
					}

					const currentJumpCoordinatesIndex = findCoordinateIndexLatLng(CurrentLatLng.lat, CurrentLatLng.lng, FirstPath.jumpCoordinates);
					const shipJumpAngle = FirstPath.shipJumpAngles[currentJumpCoordinatesIndex];

					MovingShipMarkerCurrent.setRotationAngle(shipJumpAngle);
					console.log("New Ship Jump Angle: ", shipJumpAngle);
					this.setState({pausingHyperspaceJump: true});
					this.setState({currentShipJumpAngle: shipJumpAngle});
				}

			} else if(!pausedStatus && this.state.pausingHyperspaceJump){
				if(this.state.pausingHyperspaceJump) {
					this.setState({pausingHyperspaceJump: false});
				}
			}

			previousShipCoordinateLatitude = CurrentLatLng.lat;
			previousShipCoordinateLongitude = CurrentLatLng.lng;
		}, 5)};

		let coordinateCheckInterval = coordinateCheck(MovingShipMarker);

		
		console.log("MovingShipMarker: ", MovingShipMarker);
		
		

		let startTime = Date.now();

		MovingShipMarker.on('start', () => {
			startTime = Date.now();
			const startTimeLocal = moment.utc(startTime).local().format("DD/MM/YYYY HH:mm:ss");
			const startTimeGMT = moment.utc(startTime).format("DD/MM/YYYY HH:mm:ss");
			console.log("\nShip start time Local: ", startTimeLocal);
			console.log("Ship start time GMT: ", startTimeGMT);

			const StartLatLng = MovingShipMarker.getLatLng();
  		previousShipCoordinateLatitude = StartLatLng.lat;
  		previousShipCoordinateLongitude = StartLatLng.lng;
  		console.log("Jump has started");
			const jumpStartText = `The ${this.state.name} has jumped into Hyperspace at ${StartPoint.system}`;
			this.setState({inHyperspace: true});
			this.props.dispatch( addItemToDataStream(jumpStartText) );
			this.props.dispatch( shipIsInHyperspace() );
		});

		MovingShipMarker.on('click', e => {
			console.log("Falcon clicked at: ", e.latlng);
			const galacticX = getGalacticXFromLongitude(e.latlng.lng);
			const galacticY = getGalacticYFromLatitude(e.latlng.lat);
			const shipClickText = `The ${this.state.name} is at X: ${galacticX.toFixed(2)} and Y: ${galacticY.toFixed(2)}`;
			this.props.dispatch( addItemToDataStream(shipClickText) );
		});

		MovingShipMarker.on('end', () => {
  		const endTime = Date.now();
  		clearInterval(coordinateCheckInterval);
  		const CurrentLatLng = MovingShipMarker.getLatLng();
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

	  		console.log(`\n\nShip has arrived at ${NodeData.system}.`);
	  		console.log(`Travel Time: ${hoursDisplayed} ${minutesDisplayed} ${travelTimeSeconds % 60} second(s).`);
	  		console.log(`Distance Traveled:  ${distanceTraveled} parsecs.`);
	  		console.log(`Average Speed: ${averageSpeed} parsecs per second.`);
	  		console.log("Current Lat Lng: ", CurrentLatLng);

	  		const shipArrivalText = `The ${this.state.name} has arrived at ${NodeData.system}.`;


	  		this.props.dispatch( addItemToDataStream(shipArrivalText) );
	  		this.props.dispatch( shipHasExitedHyperspace() );

  		}
  		this.setState({location: [currentShipLatitude, currentShipLongitude]});
		});

		MovingShipMarker.addTo(map);
		MovingShipMarker.start();

		this.setState({MovingShipMarker: MovingShipMarker});
  }

  setStationaryShipMarker(Options) {

  	const hyperspacePathCollections = Options.hyperspacePathCollections;
  	const StartPoint = Options.StartPoint;
  	const StartNode = Options.StartNode;
		const startFreeSpaceJump = !nodeAndPointAreEqual(StartPoint, StartNode);
		const FirstPath = hyperspacePathCollections[0];
		const shipInitialJumpAngle = (startFreeSpaceJump)? jumpAngleGalactic(StartPoint, StartNode) : FirstPath.shipJumpAngles[0];
		this.setState({location: [StartPoint.lat, StartPoint.lng]});
		this.setState({currentShipJumpAngle: shipInitialJumpAngle});

  }


 
  zoomToShip(e) {

  		console.log("this.state.MovingShipMarker: ", this.state.MovingShipMarker);

      // const lat = this.props.activeSystem.lat;
      // const lng = this.props.activeSystem.lng;
      // const systemCenter = [lat, lng];
      // const newZoom = 6;
      // const map = this.props.map;
      // const dataStreamMessage = "Zoomed to " + this.props.activeSystem.system + ' ...';
      // this.props.dispatch( addItemToDataStream(dataStreamMessage) );
      // map.flyTo(systemCenter, newZoom, {animate: false});
      // if(this.props.mobileStatus) {
      //   this.props.dispatch(zoomToAndPanIsOn());
      // }

  }


  onClick(e) {
  	console.log("Ship Clicked: ", this.state.name);
  }

  render() {
  	const zIndex = 282;
    const StarShipsToRender = renderComponentsOrNull(this.state.StarShipComponents);
		const shipIcon = getShipIcon(true);
		// const shipAngleInitial = (this.props.hyperspacePathCollections.length > 0)? 


  	return (
  		<div style={ {} }>
  			<If condition={ this.state.inHyperspace }>
          <Then>
          	{ StarShipsToRender }
          </Then>
          <Else>
          	<div style={ {} }>	          	
							<RotatedMarker
							  key={uuidv4()} 
							  position={this.state.location}
							  rotationAngle={this.state.currentShipJumpAngle}
							  rotationOrigin={'center'} 
							  zIndexOffset={2}
							  icon={shipIcon}
							  onClick={(e) => this.onClick(e)}
							>
							</RotatedMarker>
		        </div>
          </Else>
        </If>
  		</div>
  	)
  }
}


function pointAndLocationAreSame(Point, location) {
	if(Point.lat === location[0] && Point.lng === location[1]) {
		return true;
	} else {
		return false;
	}
}


function getFlyBounds(mobileStatus, navigationControls) {
  if(!mobileStatus && navigationControls) {
    return {
      paddingTopLeft: [420, 0]
    };
  } else {
    return {};
  }
}



function getInternalNodes(startNodeId, endNodeId, nodes, startFreeSpaceJump, endFreeSpaceJump) {
	const internalNodes = nodes.filter(n => {
		return (n.nodeId !== startNodeId && n.nodeId !== endNodeId);
	});

	if(startFreeSpaceJump) {
		const StartFound = nodes.find(n => {
			return (n.nodeId === startNodeId);
		});
		internalNodes.unshift(StartFound);
	}

	if(endFreeSpaceJump) {
		const EndFound = nodes.find(n => {
			return (n.nodeId === endNodeId);
		});
		internalNodes.push(EndFound);
	}
	return internalNodes;
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
};

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

function getMarkerDurationsArray(speed, coordinatesArray, distanceBetweenPointsArray, startFreeSpaceJump, endFreeSpaceJump) {
	let durationsArray = [];
	for(let i=1; i < coordinatesArray.length; i++) {
		const coordinate = coordinatesArray[i];
		const distanceBetweenPoints = distanceBetweenPointsArray[i];
		const jumpIsStartAndFreeSpace = startFreeSpaceJump && i === 1;
		const jumpIsEndAndFreeSpace = endFreeSpaceJump && i === coordinatesArray.length - 1;
		let currentSpped = (jumpIsStartAndFreeSpace || jumpIsEndAndFreeSpace)? speed / 2.0 : speed;

		const duration = (distanceBetweenPoints / currentSpped) * 1000.0;
		durationsArray.push(duration);
	}
	return durationsArray;
};



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

function modifyShipPathForFreeSpaceJumps(Options) {
	const StartPoint = Options.StartPoint;
	const EndPoint = Options.EndPoint;
	const StartNode = Options.StartNode;
	const EndNode = Options.EndNode;
	let ShipPath = Options.ShipPath;
	const startFreeSpaceJump = !nodeAndPointAreEqual(StartPoint, StartNode);
	const endFreeSpaceJump = !nodeAndPointAreEqual(EndPoint, EndNode);

	if(startFreeSpaceJump) {
		ShipPath.jumpCoordinates.unshift([StartPoint.lat, StartPoint.lng]);
		const startFreeSpaceJumpDistance = distanceBetweenPoints(StartPoint, StartNode);
		ShipPath.jumpDistances.unshift(0);
		ShipPath.jumpDistances[1] = startFreeSpaceJumpDistance;
		const freeSpaceJumpStartAngle = jumpAngleGalactic(StartPoint, StartNode); 
		ShipPath.shipJumpAngles.unshift(freeSpaceJumpStartAngle);
	}

	if(endFreeSpaceJump) {
		ShipPath.jumpCoordinates.push([EndPoint.lat, EndPoint.lng]);
		const endFreeSpaceJumpDistance = distanceBetweenPoints(EndPoint, EndNode);
		ShipPath.jumpDistances.push(endFreeSpaceJumpDistance);
		const freeSpaceJumpEndAngle = jumpAngleGalactic(EndNode, EndPoint); 
		ShipPath.shipJumpAngles.push(freeSpaceJumpEndAngle);
		ShipPath.nodes.push(EndPoint);
	}
	return ShipPath;
};


// Gives accurate ship display angles
function jumpAngleGalactic(CurrentPoint, TargetPoint) { // (3, 3) and (4, 1)
  const currentGalacticX = CurrentPoint.xGalactic;
  const currentGalacticY = CurrentPoint.yGalactic;
  const targetGalacticX = CurrentPoint.xGalactic;
  const targetGalacticY = CurrentPoint.yGalactic;
  const targetIsPositiveX = (parseFloat(TargetPoint.xGalactic) > 0 && parseFloat(CurrentPoint.xGalactic) < 0)? true : false;
  const targetIsNegativeX = (parseFloat(TargetPoint.xGalactic) < 0 && parseFloat(CurrentPoint.xGalactic) > 0)? true : false;
  const targetHasCrossedYAxis = (targetIsPositiveX || targetIsNegativeX)? true : false ;
  const targetIsPositiveY = (parseFloat(CurrentPoint.yGalactic) < 0 && parseFloat(TargetPoint.yGalactic) > 0)? true : false;
  const targetIsNegativeY = (parseFloat(CurrentPoint.yGalactic) > 0 && parseFloat(TargetPoint.yGalactic) < 0)? true : false;
  const targetHasCrossedXAxis = (targetIsPositiveY || targetIsNegativeY)? true : false ;

  if(targetHasCrossedXAxis || targetHasCrossedYAxis) {
    // console.log("\ntargetHasCrossedYAxis: ", targetHasCrossedYAxis);
    // console.log("targetHasCrossedXAxis: ", targetHasCrossedXAxis);
    // console.log("TargetPoint: ", TargetPoint);
    // console.log("CurrentPoint: ", CurrentPoint);
  }

  if(targetHasCrossedYAxis) {
    const targetXFromOriginCrossOver = Math.abs(TargetPoint.xGalactic - CurrentPoint.xGalactic);
    // console.log("targetXFromOriginCrossOver: ", targetXFromOriginCrossOver);
  }

  if(targetHasCrossedXAxis) {
    const targetYFromOriginCrossOver = Math.abs(TargetPoint.yGalactic - CurrentPoint.yGalactic);
    // console.log("targetYFromOriginCrossOver: ", targetYFromOriginCrossOver);
  }

  const targetXFromOrigin = (targetHasCrossedYAxis)? Math.abs(TargetPoint.xGalactic - CurrentPoint.xGalactic) : (Math.abs(TargetPoint.xGalactic) - Math.abs(CurrentPoint.xGalactic));
  const targetYFromOrigin = (targetHasCrossedXAxis)? Math.abs(TargetPoint.yGalactic - CurrentPoint.yGalactic) : (Math.abs(TargetPoint.yGalactic) -  Math.abs(CurrentPoint.yGalactic)); 

  const targetXFromOriginSquared = targetXFromOrigin ** 2;
  const targetYFromOriginSquared = targetYFromOrigin ** 2;
  const radius = Math.sqrt( targetXFromOriginSquared + targetYFromOriginSquared );
  const targetXOverRadius = (targetXFromOrigin / radius);
  const jumpAngle = Math.acos(targetXOverRadius);
  const jumpAngleDegrees = radiansToDegrees(jumpAngle);
  // console.log("\nJump angle is: ", jumpAngleDegrees);

  if((TargetPoint.xGalactic < 0.00 && TargetPoint.yGalactic < 0.00)) { // III
    const jumpAngleInQuad3 = (TargetPoint.yGalactic < CurrentPoint.yGalactic)?  270.0 - jumpAngleDegrees :   270.0 + jumpAngleDegrees;
    const adjustedJumpAngle = jumpAngleInQuad3;
    // console.log("Jump angle in III: ", adjustedJumpAngle % 360);
    return (adjustedJumpAngle % 360);
  } else if(TargetPoint.xGalactic  >= 0.00 && TargetPoint.yGalactic >= 0.00) { // I
    const jumpAngleInQuad1 = (TargetPoint.yGalactic > CurrentPoint.yGalactic)?  90.0 - jumpAngleDegrees :   90 + jumpAngleDegrees;
    const adjustedJumpAngle = jumpAngleInQuad1;
    // console.log("Jump angle in I: ", adjustedJumpAngle % 360);
    return (adjustedJumpAngle % 360);
  } else if(TargetPoint.xGalactic  >= 0.00 && TargetPoint.yGalactic < 0.00) { // II
    const jumpAngleInQuad2 = (TargetPoint.yGalactic > CurrentPoint.yGalactic)? 450.0 - jumpAngleDegrees :   90.0 + jumpAngleDegrees;
    const adjustedJumpAngle = jumpAngleInQuad2;
    // console.log("Jump angle in II: ", adjustedJumpAngle % 360);
    return (adjustedJumpAngle % 360);
  } else if(TargetPoint.xGalactic  < 0.00 && TargetPoint.yGalactic >= 0.00){ // IV
    const jumpAngleInQuad4 = (TargetPoint.yGalactic > CurrentPoint.yGalactic)?  jumpAngleDegrees + 270.0 :   270.0 - jumpAngleDegrees;
    const adjustedJumpAngle = jumpAngleInQuad4;
    // console.log("Jump angle in IV: ", adjustedJumpAngle % 360);
    return (adjustedJumpAngle % 360);
  }
};

function radiansToDegrees(radians) {
  return radians * ( 180 / Math.PI) % 360;
};


function distanceBetweenPoints(Point1, Point2) {
  const pointOneCoordinates = [Point1.xGalactic, Point1.yGalactic];
  const pointTwoCoordinates = [Point2.xGalactic, Point2.yGalactic];
  const distanceBetweenNodeAndPoint = distance(pointOneCoordinates, pointTwoCoordinates);
  return distanceBetweenNodeAndPoint;
};


function getGalacticYFromLatitude(latitude) {
  return  (-3.07e-19*(latitude**12)) + (-1.823e-18*(latitude**11)) + (4.871543e-15*(latitude**10)) + (4.1565807e-14*(latitude**9)) + (-2.900986202e-11 * (latitude**8)) + (-1.40444283864e-10*(latitude**7)) + (7.9614373223054e-8*(latitude**6)) + (7.32976568692443e-7*(latitude**5)) + (-0.00009825374539548058*(latitude**4)) + (0.005511093818675318*(latitude**3)) + (0.04346753629461727 * (latitude**2)) + (111.30155374684914 * latitude);
};

function getGalacticXFromLongitude(longitude) {
  return (111.3194866138503 * longitude);
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

export default connect(mapStateToProps)(Ship);