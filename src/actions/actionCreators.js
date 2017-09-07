import * as Actions from '../constants/actionTypes.js';
export function zoomToSystem(currentSystem) {
	return { 
		type: Actions.ZOOM_TO_SYSTEM,
		payload: currentSystem
	}
}
export function zoomToSystemError(error) {
	return {
		type: Actions.ZOOM_TO_SYSTEM_ERROR,
		payload: error
	}
}
export function setStartPosition(StartPosition) {
	return { 
		type: Actions.SET_START_POSITION,
		payload: StartPosition
	}
}
export function setEndPosition(EndPosition) {
	return { 
		type: Actions.SET_END_POSITION,
		payload: EndPosition
	}
}
export function setStartPositionError(error) {
	return {
		type: Actions.SET_START_POSITION_ERROR,
		payload: error
	}
}
export function setEndPositionError(error) {
	return {
		type: Actions.SET_END_POSITION_ERROR,
		payload: error
	}
}
export function setStartNode(StartNode) {
	return { 
		type: Actions.SET_START_NODE,
		payload: StartNode
	}
}
export function setEndNode(EndNode) {
	return { 
		type: Actions.SET_END_NODE,
		payload: EndNode
	}
}
export function setStartNodeError(error) {
	return {
		type: Actions.SET_START_NODE_ERROR,
		payload: error
	}
}
export function setEndNodeError(error) {
	return {
		type: Actions.SET_END_NODE_ERROR,
		payload: error
	}
}
export function searchSystemsStart() {
	return {
		type: Actions.SEARCH_SYSTEMS_ON
	}
}
export function searchSystemsFinish() {
	return {
		type: Actions.SEARCH_SYSTEMS_OFF
	}
}
export function getZoomValue() {
	return {
		type: Actions.GET_ZOOM_VALUE
	}
}
export function setZoomValue(newZoom) {
	return {
		type: Actions.SET_ZOOM_VALUE,
		payload: newZoom
	}
}
export function renderMapOn() {
	return {
		type: Actions.MAP_RENDER_ON
	}
}
export function renderMapOff() {
	return {
		type: Actions.MAP_RENDER_OFF
	}
}
export function renderMapStatus() {
	return {
		type: Actions.MAP_RENDER_STATUS
	}
}
export function hyperspaceNavigationUpdateOn() {
	return {
		type: Actions.UPDATE_HYPERSPACE_NAVIGATION_ON
	}
}
export function hyperspaceNavigationUpdateOff() {
	return {
		type: Actions.UPDATE_HYPERSPACE_NAVIGATION_OFF
	}
}
export function zoomChangeOn() {
	return {
		type: Actions.Actions.ZOOM_CHANGE_ON
	}
}
export function zoomChangeOff() {
	return {
		type: Actions.ZOOM_CHANGE_OFF
	}
}
export function zoomChangeStatus() {
	return {
		type: Actions.ZOOM_CHANGE_STATUS
	}
}
export function loadHyperspacePathCollections(collections) {
	return {
		type: Actions.LOAD_HYPERSPACE_COLLECTION,
		payload: collections
	}
}
export function addHyperspacePathToCollection(collectionToAdd) {
	return {
		type: Actions.ADD_HYPERSPACE_COLLECTION,
		payload: collectionToAdd
	}
}
export function emptyHyperspacePathCollections() {
	return {
		type: Actions.EMPTY_HYPERSPACE_COLLECTION
	}
}
export function errorHyperspacePath(error) {
	return {
		type: Actions.ERROR_HYPERSPACE_COLLECTION
	}
}
export function updateHyperspacePaths() {
	return {
		type: Actions.HYPERSPACE_PATH_CHANGE_ON
	}
}
export function stopUpdatingHyperspacePath() {
	return {
		type: Actions.HYPERSPACE_PATH_CHANGE_OFF
	}
}
export function hyperspaceUpdateStatus() {
	return {
		type: Actions.HYPERSPACE_PATH_CHANGE_STATUS
	}
}
export function pathSearchStartOn() {
	return {
		type: Actions.PATH_SEARCH_START_ON
	}
}
export function pathSearchStartOff() {
	return {
		type: Actions.PATH_SEARCH_START_OFF
	}
}
export function pathSearchEndOn() {
	return {
		type: Actions.PATH_SEARCH_END_ON
	}
}
export function pathSearchEndOff() {
	return {
		type: Actions.PATH_SEARCH_END_OFF
	}
}
export function pinPointStartOn() {
	return {
		type: Actions.PIN_POINT_START_ON
	}
}
export function pinPointStartOff() {
	return {
		type: Actions.PIN_POINT_START_OFF
	}
}
export function pinPointStartToggle() {
	return {
		type: Actions.PIN_POINT_START_TOGGLE
	}
}
export function pinPointEndOn() {
	return {
		type: Actions.PIN_POINT_END_ON
	}
}
export function pinPointEndOff() {
	return {
		type: Actions.PIN_POINT_END_OFF
	}
}
export function pinPointEndToggle() {
	return {
		type: Actions.PIN_POINT_END_TOGGLE
	}
}
export function calculateHyperspaceJumpOn() {
	return {
		type: Actions.CALCULATE_HYPERSPACE_JUMP_ON
	}
}
export function calculateHyperspaceJumpOff() {
	return {
		type: Actions.CALCULATE_HYPERSPACE_JUMP_OFF
	}
}
export function setStartSystem(system) {
	console.log("set start system: ", system);
	return { 
		type: Actions.SET_START_SYSTEM,
		payload: system
	}	
}
export function setEndSystem(system) {
	console.log("set end system: ", system);
	return { 
		type: Actions.SET_END_SYSTEM,
		payload: system
	}	
}
export function setStartSystemError(error) {
	return {
		type: Actions.SET_START_SYSTEM_ERROR,
		payload: error
	}
}
export function setEndSystemError(error) {
	return {
		type: Actions.SET_END_SYSTEM_ERROR,
		payload: error
	}
}
export function emptyStartSystem() {
	return {
		type: Actions.SET_START_SYSTEM_EMPTY
	}
}
export function emptyEndSystem() {
	return {
		type: Actions.SET_END_SYSTEM_EMPTY
	}
}
export function setMaxJumps(jumps) {
	return {
		type: Actions.SET_MAX_JUMPS,
		payload: jumps
	}
}
export function setMaxJumpsError(error) {
	return {
		type: Actions.SET_MAX_JUMPS_ERROR,
		payload: error
	}
}
export function setNumberOfHyperspacePaths(pathNumber) {
	return {
		type: Actions.SET_PATH_NUMBER,
		payload: jumps
	}
}
export function setNumberOfHyperspacePathsError(error) {
	return {
		type: Actions.SET_PATH_NUMBER_ERROR,
		payload: error
	}
}
export function generateNewMapHash() {
	return {
		type: Actions.GENERATE_MAP_HASH
	}
}
export function generateDefaultMapHash() {
	return {
		type: Actions.DEFAULT_MAP_HASH
	}
}
export function generateSameMapHash() {
	return {
		type: Actions.SAME_MAP_HASH
	}
}
