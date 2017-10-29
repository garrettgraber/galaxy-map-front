import React from 'react';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';
import hash from 'string-hash';
import distance from 'euclidean-distance';

import HyperspacePathCollection from '../components/hyperspaceNavigation/hyperspacePathCollection.js';
import HyperspaceNavigationPoint from '../components/hyperspaceNavigation/hyperspaceNavigationPoint.js';

import {
	nodeAndPointAreEqual,
	createFreespaceLane
} from '../components/hyperspaceNavigation/hyperspaceMethods.js'


// '../../components/hyperspaceNavigation/hyperspacePathCollection.js';



export class Planet {
	constructor(
		systemValue,
		sectorValue,
		regionValue,
		coordinatesValue,
		xGalactic = 0,
		yGalactic = 0,
		xGalacticLong = 0,
		yGalacticLong = 0,
		hasLocation = false,
		LngLat = [],
		lat = null,
		lng = null,
		zoom = 5,
		link = '',
		textWidth = 0
	) {
		this.system = systemValue;
		this.sector = sectorValue;
		this.region = regionValue;
		this.coordinates = coordinatesValue;
		this.xGalactic = xGalactic;
		this.yGalactic = yGalactic;
		this.xGalacticLong = xGalacticLong;
		this.yGalacticLong = yGalacticLong;
		this.hasLocation = hasLocation;
		this.LngLat = LngLat;
		this.lng = (LngLat.length)? LngLat[0] : null;
		this.lat = (LngLat.length)? LngLat[1] : null;
		this.zoom = zoom;
		this.link = link;
		this.textWidth = textWidth;
	}

	starInMapView(mapWidth, mapHeight, MapBoundaries, currentZoom) {
	    const mapOffSetLng = 0;
	    const mapOffSetLat = 0;
	    
	    const inNorthSouthRange = (MapBoundaries.south < this.lat && this.lat < MapBoundaries.north) ? true : false;
	    const inEastWestRange = (MapBoundaries.west< this.lng && this.lng < MapBoundaries.east) ? true : false;
	    const objectInvView = (inNorthSouthRange && inEastWestRange) ? true : false;
	    return objectInvView;
	}

	starIsVisible(currentZoom) {
		let starIsViewableAtZoom = false;
    if(this.zoom === 0) {
			starIsViewableAtZoom = true;
    } else if(this.zoom === 1 && currentZoom >= 3) {
    	starIsViewableAtZoom = true;
    } else if(this.zoom === 2 && currentZoom >= 5) {
    	starIsViewableAtZoom = true;
    } else if(this.zoom === 3 && currentZoom >= 6) {
    	starIsViewableAtZoom = true;
    } else {
    	starIsViewableAtZoom = false;
    }
      return starIsViewableAtZoom;
  }

	galaticXYtoMapPoints(xGalactic, yGalactic) {
    const galacticOffset = 19500;
    const galacticDivisor = 39.0;
    let yPoint;
    if(yGalactic > 0 && xGalactic > 0) {
      yPoint = -(yGalactic - galacticOffset) / galacticDivisor;
    } else if (yGalactic < 0) {
      yPoint = ((-yGalactic) + galacticOffset) /  galacticDivisor;
    } else if(yGalactic > 0 && xGalactic < 0) {
      yPoint = (galacticOffset - yGalactic) / galacticDivisor;
    }
    if(yGalactic === 0) {
      yPoint = 0;
    }
    const xPoint = (xGalactic + galacticOffset) / galacticDivisor;
    return {
      xPoint: xPoint,
      yPoint: yPoint
    };
	}

	planetIsAtZoomLevel(currentZoom) {
		let atZoomLevel = false;
		switch(this.zoom) {
			case 0:
				atZoomLevel = true;
				break;
			case (this.zoom === 1 && currentZoom >= 3): 
				atZoomLevel = true;
				break;
			case (this.zoom === 2 && currentZoom >= 5): 
				atZoomLevel = true;
				break;
			case (this.zoom === 3 && currentZoom >= 6): 
				atZoomLevel = true;
				break;
			default:
				atZoomLevel = false;
		}
		return atZoomLevel;
	}
};

class HyperSpaceLane {
	constructor(
		name,
		hyperspaceHash,
		start,
		end,
		startCoordsLngLat,
		endCoordsLngLat,
		length,
		link,
		_start,
		_end,
		coordinates,
		_id = 0
	) {
		this.name = name || "No Name";
		this.hyperspaceHash = hyperspaceHash;
		this.start = start;
		this.end = end;
		this.startCoordsLngLat = coordinateStringToArray(startCoordsLngLat);
		this.endCoordsLngLat = coordinateStringToArray(endCoordsLngLat);
		this.length = length;
		this.link = link || "No Link";
		this._start = _start;
		this._end = _end;
		this.coordinates = coordinateStringToArray(coordinates);
		this._id = _id;
	}

	reverseCoordinatesLatLng() {
		// const latBefore = this.coordinates[0][0];
		// _.forEach(this.coordinates, function(el) {
		//   el.reverse();
		// });
		// const latAfter = this.coordinates[0][0];
		// console.log("Before and after the same: ", (latBefore === latAfter)? true : false);

		const coordinatesCopy = _.map(this.coordinates, _.clone);
		// console.log("coordinatesCopy equals this.coordinates: ", coordinatesCopy == this.coordinates);
		_.forEach(coordinatesCopy, function(el) {
		  el.reverse();
		});
		// console.log("coordinatesCopy equals this.coordinates after reverse: ", coordinatesCopy == this.coordinates);
		// console.log("coordinatesCopy: ", coordinatesCopy);
		// console.log("this.coordinates: ", this.coordinates);
		this.coordinates = coordinatesCopy;
		// console.log("this.coordinates after: ", this.coordinates);

	}
};

function coordinateStringToArray(coordinates) {
	if(Array.isArray(coordinates)) {
		return coordinates;
	} else {
		let jsonJumpCoordinates = JSON.parse("[" + coordinates + "]");
		return jsonJumpCoordinates[0];			
	}
};

export class HyperSpaceNode {
	constructor(system, lng, lat, hyperspaceLanes, nodeId, textWidth = 0, xGalacticLong, yGalacticLong) {
		this.system = system;
		this.lng = lng;
		this.lat = lat;
		this.hyperspaceLanes = hyperspaceLanes;
		this.nodeId = nodeId;
		this.textWidth = textWidth;
		this.xGalacticLong = xGalacticLong;
		this.yGalacticLong = yGalacticLong;
	}

	latLng() {
		return {
			lat: this.lat,
			lng: this.lng
		};
	}
};

export class HyperSpacePath {
	constructor(start, end, length, jumps, nodes, hashValue = '', numberOfJumps = null) {
		this.start = start;
		this.end = end;
		this.length = length;
		this.jumps = jumps;
		this.nodes = nodes;
		this.hashValue = hashValue;
		this.numberOfJumps = numberOfJumps;
	}

	createArrayOfHyperspaceLanes(totalLanesInCollection) {
		const hyperspaceLanesArray = [];
		for(let id of this.jumps) {
			const foundLaneData = _.find(totalLanesInCollection, {_id : id});
			// console.log("foundLaneData: ", foundLaneData);

			if(foundLaneData === undefined) {
				// console.log("totalLanesInCollection: ", totalLanesInCollection);
			}
			const Lane = new HyperSpaceLane(
				foundLaneData.name,
				foundLaneData.hyperspaceHash,
				foundLaneData.start,
				foundLaneData.end,
				foundLaneData.startCoordsLngLat,
				foundLaneData.endCoordsLngLat,
				foundLaneData.length,
				foundLaneData.link,
				foundLaneData._start,
				foundLaneData._end,
				foundLaneData.coordinates,
				foundLaneData._id
			);
			Lane.reverseCoordinatesLatLng();
			hyperspaceLanesArray.push(Lane);
		}
		return hyperspaceLanesArray;
	}

	createArrayOfHyperspaceNodes(totalNodesInCollection) {
		const hyperspaceNodesArray = [];
		for(let id of this.nodes) {
			let foundNodeData = _.find(totalNodesInCollection, {nodeId : id});
			hyperspaceNodesArray.push(foundNodeData);
		}
		return hyperspaceNodesArray;
	}

	getReversedHyperLanes(totalLanesInCollection, totalNodesInCollection) {
		let reverseLanesSet = new Set();
		let correctLanesSet = new Set();
		for(let i=0; i < this.jumps.length; i++) {
			const jumpLaneId = this.jumps[i];
			let JumpLane = _.find(totalLanesInCollection, { '_id': jumpLaneId });
			const start = this.nodes[i];
			const end = this.nodes[i + 1];
			if(start !== JumpLane._start) {
				reverseLanesSet.add(JumpLane._id);
				this.jumps[i] = -(JumpLane._id);
			} else {
				correctLanesSet.add(JumpLane._id);
			}
			let intersection = new Set([...reverseLanesSet].filter(x => correctLanesSet.has(x)));
		}
		const reversedLanes = [...reverseLanesSet];
		return reversedLanes;
	}

	generateHashNumber(totalLanesInCollection) {
		let sumOfHashes = '|';
		for(let i=0; i < this.jumps.length; i++) {
			const jumpLaneId = this.jumps[i];
			let JumpLane = _.find(totalLanesInCollection, { '_id': jumpLaneId });
			const jumpLaneHash = JumpLane.hyperspaceHash;
			sumOfHashes += jumpLaneHash + '|';
		}
		const jumpHash = hash(sumOfHashes);
		return jumpHash;
	}

	validateJump(totalLanesInCollection, totalNodesInCollection) {
		if(this.jumps.length + 1 === this.nodes.length) {
			for(let i=0; i < this.jumps.length; i++) {
				const jumpLaneId = this.jumps[i];
				let JumpLane = _.find(totalLanesInCollection, { '_id': jumpLaneId });
				const startId = this.nodes[i];
				let StartNode = _.find(totalNodesInCollection, { 'nodeId': startId });
				const endId = this.nodes[i + 1];
				let EndNode = _.find(totalNodesInCollection, { 'nodeId': endId });
				const jumpStartCoordinates = JumpLane.startCoordsLngLat;
				const jumpEndCoordinates = JumpLane.endCoordsLngLat;
				const firstCoordinates = JumpLane.coordinates[0];
				const secondCoordinates = JumpLane.coordinates[JumpLane.coordinates.length - 1];
				const startIsInvalid = (
					StartNode.system !== JumpLane.start ||
					!_.isEqual(jumpStartCoordinates, firstCoordinates)
				);
				const endIsInvalid = (
					EndNode.system !== JumpLane.end ||
					!_.isEqual(jumpEndCoordinates, secondCoordinates)
				);

				if(startIsInvalid || endIsInvalid) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

};

export class HyperSpacePathCollection {
	constructor(start, end, paths, lanes, nodes) {
		this.start = start;
		this.end = end;
		this.paths = paths;
		this.lanes = lanes;
		this.nodes = nodes;
	}

	linkHyperspacePaths() {
		let laneSet = new Set([...this.lanes]);
		let indexSet = new Set();
	  	for(let path of this.paths) {
	  		let reversedHyperspaceLanes = path.getReversedHyperLanes(this.lanes, this.nodes);
	  		for(let reversedLaneId of reversedHyperspaceLanes) {
	  			const index = _.findIndex(this.lanes, {_id: reversedLaneId});
	  			indexSet.add(index);
	  		}
	  	}
		for(let index of indexSet) {
			const JumpLane = this.lanes[index];
			const reversedJumpId = -Math.abs(JumpLane._id);
			const jumpCoordinatesReversed = JumpLane.coordinates.slice().reverse();
			const hyperspaceHash = uuidv4();
			const ReversedHyperspaceLane = new HyperSpaceLane(
				JumpLane.name,
				hyperspaceHash,
				JumpLane.end,
				JumpLane.start,
				JumpLane.endCoordsLngLat,
				JumpLane.startCoordsLngLat,   
				JumpLane.length,
				JumpLane.link,
				JumpLane._end,
				JumpLane._start,
				jumpCoordinatesReversed,
				reversedJumpId
			);
  		this.lanes.push(ReversedHyperspaceLane);
  		const newIndex = _.findIndex(this.lanes, {_id: reversedJumpId});
		}
		this.validateJumps();
	}

	validateJumps() {
		console.log("\n\nValidating all jumps  **************");
		for(let path of this.paths) {
			const pathIsValid = path.validateJump(this.lanes, this.nodes);
			const jumpHashValue = (pathIsValid)? path.generateHashNumber(this.lanes) : '';
			console.log("path is valid: ", pathIsValid);
			path.hashValue = jumpHashValue;
  		}
	}

	generateHyperspacePaths() {

		console.log("generateHyperspacePaths has fired...", this.paths);
		const hyperspacePaths = [];

		for(let path of this.paths) {

			// console.log("path.hashValue: ", path.hashValue);
			// console.log("path.start: ", path.start);
			// console.log("path.end: ", path.end);

			let Path = new HyperSpacePath(
				path.start,
				path.end,
				path.length,
				path.jumps,
				path.nodes,
				path.hashValue,
				path.numberOfJumps
			);
			hyperspacePaths.push(Path);
		}
		return hyperspacePaths;
	}

	validateHyperspacePaths() {

		console.log("validateHyperspacePaths has fired...");
		const invalidJumps = [];

		for(let path of this.paths) {

			// console.log("path.hashValue: ", path.hashValue);
			// console.log("path.start: ", path.start);
			// console.log("path.end: ", path.end);

			const Path = new HyperSpacePath(
				path.start,
				path.end,
				path.length,
				path.jumps,
				path.nodes,
				path.hashValue,
				path.numberOfJumps
			);

			const jumpHash = Path.generateHashNumber(this.lanes);

			// console.log("jumpHash: ", jumpHash);
			// console.log("Path.hashValue: ", Path.hashValue);

			if(jumpHash !== Path.hashValue) {
				invalidJumps.push(jumpHash);
			}

		}
		return invalidJumps;
	}
};


export class Point {
  constructor(
  	system,
    lat,
    lng
  ) {
  	this.system = system;
    this.lat = lat;
    this.lng = lng;
  }

  normalizeLng() {
    return this.lng / 2.0;
  }

  coordinatesNormalized() {
  	// console.log("coordinates has fired!");
  	const normalizedCoordinates = [this.lat, this.normalizeLng()];
    return normalizedCoordinates;
  }
  coordinates() {
	const coordinatesLatLng = [this.lat, this.lng];
	return coordinatesLatLng;
  }
};

export class PathGenerator {
	constructor(
		StartPoint,
		EndPoint,
		StartNode,
		EndNode,
		SearchStartPoint,
		SearchEndPoint,
		SearchStartNode,
		SearchEndNode,
		activeHyperspaceJumpHash,
		hyperspaceHash,
		HyperspaceCollectionsComponents,
		hyperspacePathCollections,
		hyperspacePathChange
	) {
		this.StartPoint = _.cloneDeep(StartPoint);
		this.EndPoint = _.cloneDeep(EndPoint);
		this.StartNode = _.cloneDeep(StartNode);
		this.EndNode = _.cloneDeep(EndNode);
		this.SearchStartPoint = _.cloneDeep(SearchStartPoint);
		this.SearchEndPoint = _.cloneDeep(SearchEndPoint);
		this.SearchStartNode = _.cloneDeep(SearchStartNode);
		this.SearchEndNode = _.cloneDeep(SearchEndNode);
    const activeHyperspaceJump = activeHyperspaceJumpHash !== null;
    const selectedHyperspaceJump  = hyperspaceHash !== null;
    const activeJumpNoGridSelection = activeHyperspaceJump && !selectedHyperspaceJump;
    let hyperspaceHashSelected = null;
    if(activeJumpNoGridSelection) {
      hyperspaceHashSelected = activeHyperspaceJumpHash;
    } else if(selectedHyperspaceJump) {
      hyperspaceHashSelected = hyperspaceHash;
    }
    this.hyperspaceHashSelected = hyperspaceHashSelected;
    this.navComponentsRendered = [];
    this.HyperspaceCollectionsComponents = HyperspaceCollectionsComponents;
    this.hyperspacePathCollections = hyperspacePathCollections;
    this.hyperspacePathChange = hyperspacePathChange;
	}

  distanceStartPointToStartNode() { 
  	return distanceBetweenPointsGalactic(this.StartPoint, this.StartNode);
  }
  
  distanceEndPointToEndNode() {
  	return distanceBetweenPointsGalactic(this.EndPoint, this.EndNode);
  }

  distanceStartPointToEndPoint() {
		return distanceBetweenPointsGalactic(this.StartPoint, this.EndPoint);
  }

  distanceStartNodeToEndNode() {
  	return distanceBetweenPointsGalactic(this.StartNode, this.EndNode);	
  }

  distanceTotalJumpedToNodes() {
  	return this.distanceEndPointToEndNode() + this.distanceStartPointToStartNode();
  }

  closeEnoughForFreespaceJump() {
  	return (this.distanceTotalJumpedToNodes() >= this.distanceStartPointToEndPoint());
  }

  pointsShareNode() {
  	return (this.StartNode.nodeId === this.EndNode.nodeId);
  }

  needsFreeSpaceJumpsToNodes() {
  	return this.pointsShareNode() && !this.closeEnoughForFreespaceJump();
  }

  distanceSearchStartPointToStartNode() { 
  	return distanceBetweenPointsGalactic(this.SearchStartPoint, this.SearchStartNode);
  }
  
  distanceSearchEndPointToEndNode() {
  	return distanceBetweenPointsGalactic(this.SearchEndPoint, this.SearchEndNode);
  }

  distanceSearchStartPointToEndPoint() {
		return distanceBetweenPointsGalactic(this.SearchStartPoint, this.SearchEndPoint);
  }

  distanceSearchStartNodeToEndNode() {
  	return distanceBetweenPointsGalactic(this.SearchStartNode, this.SearchEndNode);	
  }

  distanceSearchTotalJumpedToNodes() {
  	return this.distanceSearchEndPointToEndNode() + this.distanceSearchStartPointToStartNode();
  }

  searchPointsCloseEnoughForFreespaceJump() {
  	return (this.distanceSearchTotalJumpedToNodes() >= this.distanceSearchStartPointToEndPoint());
  }

  searchPointsShareNode() {
  	return (this.SearchStartNode.nodeId === this.SearchEndNode.nodeId);
  }

  shouldAFreeSpaceJumpBePlotted() {
  	return (this.searchPointsShareNode() || this.searchPointsCloseEnoughForFreespaceJump());
  }

  hyperspaceJumpsInArray() {
  	return (this.hyperspacePathCollections.length > 0);
  }

  pathUpdateAndHyperspaceJumpsInArray() {
  	return this.hyperspacePathChange && this.hyperspaceJumpsInArray();
  }

  edgeLocations() {
		return {
      StartPoint: this.StartPoint,
      EndPoint: this.EndPoint,
      StartNode: this.StartNode,
      EndNode: this.EndNode
    };
	}

 	edgeLocationsSearch() {
 		return {
	    StartPoint: this.SearchStartPoint,
	    EndPoint: this.SearchEndPoint,
	    StartNode: this.SearchStartNode,
	    EndNode: this.SearchEndNode,
 		};
  }

	startPointAndNodeEqual() {
		return nodeAndPointAreEqual(this.StartPoint, this.StartNode);
	}

	endPointAndNodeEqual() {
		return nodeAndPointAreEqual(this.EndPoint, this.EndNode);
	}

	hyperspacePointsArray() {
		return [
	    {
	      Point: this.SearchStartPoint,
	      isStart: true,
	      isActive: false
	    },
	    {
	      Point: this.SearchEndPoint,
	      isStart: false,
	      isActive: false
	    },
	    {
	      Point: this.StartPoint,
	      isStart: true,
	      isActive: true
	    },
	    {
	      Point: this.EndPoint,
	      isStart: false,
	      isActive: true
	    },
	  ];
	}

	pathSearch(maxJumps, limit) {
		const shortest = (limit > 1) ? false : true;
		return {
      maxJumps: parseInt(maxJumps),
      limit: parseInt(limit),
      start: this.SearchStartNode.system,
      end: this.SearchEndNode.system,
      startPoint: this.SearchStartPoint.system,
      endPoint: this.SearchEndPoint.system,
      shortest: shortest
    };
	}

	createCollectionsComponents() {
	  const PathCollectionsComponentsArray = [];
	  for(let PathCollection of this.hyperspacePathCollections) {
	    PathCollectionsComponentsArray.push(
	    	<HyperspacePathCollection
	    		key={uuidv4()}
	    		PathCollection={PathCollection}
	    		EdgeLocations={this.edgeLocations()}
	    		hyperspaceHashDisplayed={this.hyperspaceHashSelected}
	    	/>
	    );
	  }
	  this.HyperspaceCollectionsComponents = PathCollectionsComponentsArray;
	  this.navComponentsRendered.push(PathCollectionsComponentsArray);
	}

	generateNavigationComponents() {
   if(this.hyperspacePathChange) {
      if(this.hyperspaceJumpsInArray()) {
        this.createCollectionsComponents(this.hyperspacePathCollections);
      } else if(this.needsFreeSpaceJumpsToNodes()) {
        this.addStartPointToNodeFreeSpaceLane();
        this.addEndPointToNodeFreeSpaceLane();
      } else if(this.closeEnoughForFreespaceJump()) {
        this.addFreeSpaceLane(this.StartPoint, this.EndPoint, false);
      }  else {
        this.clonePreviousHSpaceComponents();
      }
    } else if(this.hyperspaceJumpsInArray()) {
      this.clonePreviousHSpaceComponents();
    }
		this.generateHyperspaceNavigationPoints();
	}

	addStartPointToNodeFreeSpaceLane() {
    if(!this.startPointAndNodeEqual()) {
      this.addFreeSpaceLane(this.StartNode, this.StartPoint, true);
    }
	}

	addEndPointToNodeFreeSpaceLane() {
   if(!this.endPointAndNodeEqual()) {
      this.addFreeSpaceLane(this.EndNode, this.EndPoint, false);
    }
	}

	addFreeSpaceLane(Start, End, forwardDirection) {
		const FreeSpaceLaneComponent = createFreespaceLane(
      Start,
      End,
      forwardDirection
    );
    this.navComponentsRendered.push(FreeSpaceLaneComponent);
	}

	clonePreviousHSpaceComponents() {
		this.navComponentsRendered.push(_.cloneDeep(this.HyperspaceCollectionsComponents));
	}

	generateHyperspaceNavigationPoints() {
	  for(let PointValues of this.hyperspacePointsArray()) {
	    this.addPointToHyperspaceArray(PointValues.Point, PointValues.isStart, PointValues.isActive);
	  }
	}

	addPointToHyperspaceArray(Point, isStart, isActive) {
	  if(pointIsValid(Point)) {
	    this.navComponentsRendered.push(<HyperspaceNavigationPoint key={uuidv4()} HyperSpacePoint={Point} isStart={isStart} isActive={isActive} />);
	  }
	}

};


function pointIsValid(Point) {
  const pointStatus = (Point.lat !== null && Point.lng !== null)? true : false;
  return pointStatus;
}

function distanceBetweenPointsGalactic(Point1, Point2) {
  return distance(pointArrayGalactic(Point1), pointArrayGalactic(Point2));
}

function pointArrayGalactic(PointTemp) {
  return [PointTemp.xGalacticLong, PointTemp.yGalacticLong];
}
