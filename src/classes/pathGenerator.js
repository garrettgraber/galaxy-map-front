import React from 'react';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import hash from 'string-hash';
import distance from 'euclidean-distance';

import HyperspacePathCollection from '../components/hyperspaceNavigation/hyperspacePathCollection.js';
import HyperspaceNavigationPoint from '../components/hyperspaceNavigation/hyperspaceNavigationPoint.js';
import HyperSpaceLaneOverlay from '../components/hyperspaceNavigation/hyperspaceLaneOverlay.js';

import {
	nodeAndPointAreEqual,
	createFreespaceLane
} from '../components/hyperspaceNavigation/hyperspaceMethods.js';

export default class PathGenerator {
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
    this.antPathComponents = [];
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
      startNodeId: this.SearchStartNode.nodeId,
      endNodeId: this.SearchEndNode.nodeId,
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

  generateAntPath() {
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    console.log("First PathCollection: ", this.hyperspacePathCollections[0]);
    const FirstPathCollection = this.hyperspacePathCollections[0];
    if(FirstPathCollection) {
      const isSinglePath = (this.hyperspacePathCollections.length > 1)? false : true;
      const lanes = FirstPathCollection.lanes;
      let lanePathCoordinates = [];
      for(let Lane of lanes) {
        lanePathCoordinates = lanePathCoordinates.concat(Lane.coordinates);
      }
      console.log("Total coordinates: ", lanePathCoordinates.length);
      const startPoint = lanePathCoordinates[ 0 ];
      const endPoint = lanePathCoordinates[ lanePathCoordinates.length - 1 ];
      const hyperspaceHash = uuidv4();
      this.antPathComponents.push(<HyperSpaceLaneOverlay key={hyperspaceHash}  pathCoordinates={lanePathCoordinates} style={hyperspaceLanesStylePink} isSinglePath={isSinglePath} />);
    }
  }

  generateCoordinatesArray() {
    let jumpPathCoordinates = [];
    const FirstPathCollection = this.hyperspacePathCollections[0];
    if(FirstPathCollection) {
      const isSinglePath = (this.hyperspacePathCollections.length > 1)? false : true;
      const lanes = FirstPathCollection.lanes;
      for(let Lane of lanes) {
        jumpPathCoordinates = jumpPathCoordinates.concat(Lane.coordinates);
      }
    }
    if(!this.startPointAndNodeEqual() && !this.closeEnoughForFreespaceJump()) {
      jumpPathCoordinates.unshift([this.StartPoint.lng, this.StartPoint.lat]);
    }
    if(!this.endPointAndNodeEqual() && !this.closeEnoughForFreespaceJump()) {
      jumpPathCoordinates.push([this.EndPoint.lng, this.EndPoint.lat]);
    }
    if(this.closeEnoughForFreespaceJump()) {
      const startLngLat = [this.StartPoint.lng, this.StartPoint.lat];
      const endLngLat = [this.EndPoint.lng, this.EndPoint.lat];
      jumpPathCoordinates = [startLngLat, endLngLat];
    }
    const jumpPathCoordinatesCopy = _.cloneDeep(jumpPathCoordinates);
    const jumpPathCoordinatesLatLng = reverseToLatLng(jumpPathCoordinatesCopy);
    return jumpPathCoordinatesLatLng;
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
      } else {
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

  freeSpaceJumpFromStart(JumpStartPoint, JumpStartNode) {
    return nodeAndPointAreEqual(JumpStartPoint, JumpStartNode);
  }

  freeSpaceJumpFromEnd(JumpEndPoint, JumpEndNode) {
    return nodeAndPointAreEqual(JumpEndPoint, JumpEndNode);
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

function reverseToLatLng(lanesArray) {
  const latLngArray = [];
  for(let lane of lanesArray) {
    lane.reverse();
    latLngArray.push(lane);
  }
  return latLngArray;
}
