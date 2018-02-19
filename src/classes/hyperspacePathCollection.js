import _ from 'lodash';
import uuidv4 from 'uuid/v4';

import HyperSpaceLane from './hyperspaceLane.js';
import HyperSpacePath from './hyperspacePath.js';

export default class HyperSpacePathCollection {
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
		const hyperspacePaths = [];
		for(let path of this.paths) {
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
		const invalidJumps = [];
		for(let path of this.paths) {
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
			if(jumpHash !== Path.hashValue) {
				invalidJumps.push(jumpHash);
			}
		}
		return invalidJumps;
	}
};