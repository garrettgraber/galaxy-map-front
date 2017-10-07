// import * as Actions from '../constants/actionTypes.js';

import Actions from '../constants/actionTypesModule.js';

console.log("Actions: ", Actions);
// console.log("ActionModule: ", ActionModule);



export function activeHyperspaceJump(hyperspaceHash) {
	return {
		type: Actions.SET_ACTIVE_HYPERSPACE_JUMP,
		payload: hyperspaceHash
	}
}

export function nullActiveHyperspaceJump() {
	return {
		type: Actions.SET_NULL_ACTIVE_HYPERSPACE_JUMP
	}
}


export function setSelectedHyperspaceHash(hyperspaceHash) {
	return {
		type: Actions.SET_SELECTED_HYPERSPACE_HASH,
		payload: hyperspaceHash
	}
}

export function setNullHyperspaceHash() {
	return {
		type: Actions.SET_NULL_HYPERSPACE_HASH
	}
}





export function updateSouthWestMapHash(newMapHash) {
	return {
		type: Actions.UPDATE_SOUTH_WEST_MAP_HASH,
		payload: newMapHash
	}
}
export function clearSouthWestMapHash(newMapHash) {
	return {
		type: Actions.CLEAR_SOUTH_WEST_MAP_HASH,
		payload: newMapHash
	}
}


export function updateNorthEastMapHash(newMapHash) {
	return {
		type: Actions.UPDATE_NORTH_EAST_MAP_HASH,
		payload: newMapHash
	}
}
export function clearNorthEastMapHash(newMapHash) {
	return {
		type: Actions.CLEAR_NORTH_EAST_MAP_HASH,
		payload: newMapHash
	}
}


export function addItemToDataStream(dataStreamItem) {
	return { 
		type: Actions.ADD_DATA_STREAM_ITEM,
		payload: dataStreamItem
	}	
}
export function setDataStreamItemTemporary(dataStreamItem) {
	return { 
		type: Actions.SET_CURRENT_DATA_STREAM_ITEM_TEMP,
		payload: dataStreamItem
	}
}
export function mostRecentDataStreamItem(dataStreamItem) {
	return { 
		type: Actions.SET_CURRENT_DATA_STREAM_ITEM_TO_MOST_RECENT
	}	
}
export function setCurrentDataStreamItemToBlank() {
	return { 
		type: Actions.SET_CURRENT_DATA_STREAM_ITEM_TO_BLANK
	}	
}
export function deCodeAdditionalCurrentItemLetter() {
	return { 
		type: Actions.DECODE_ADDITIONAL_LETTER
	}
}
export function reEncodePreviousCurrentItemLetter() {
	return { 
		type: Actions.RE_ENCODE_PREVIOUS_LETTER
	}
}
export function zeroDecodedCurrentItemLetters() {
	return {
		type: Actions.ZERO_DECODE_LETTERS
	}
}

export function activateSystemsSearchControls() {
	return {
		type: Actions.SYSTEMS_SEARCH_CONTROLS_ON
	}
}
export function deActivateSystemsSearchControls() {
	return {
		type: Actions.SYSTEMS_SEARCH_CONTROLS_OFF
	}
}
export function toggleSystemsSearchControls() {
	return {
		type: Actions.SYSTEMS_SEARCH_CONTROLS_TOGGLE
	}
}

export function activateMapControls() {
	return {
		type: Actions.MAP_CONTROLS_ON
	}
}
export function deActivateMapControls() {
	return {
		type: Actions.MAP_CONTROLS_OFF
	}
}
export function toggleMapControls() {
	return {
		type: Actions.MAP_CONTROLS_TOGGLE
	}
}

export function activateHyperspaceNavigationControls() {
	return {
		type: Actions.HYPERSPACE_NAVIGATION_CONTROLS_ON
	}
}
export function deActivateHyperspaceNavigationControls() {
	return {
		type: Actions.HYPERSPACE_NAVIGATION_CONTROLS_OFF
	}
}
export function toggleHyperspaceNavigationControls() {
	return {
		type: Actions.HYPERSPACE_NAVIGATION_CONTROLS_TOGGLE
	}
}

export function setActiveSystem(newActiveSystem) {
	return { 
		type: Actions.SET_SYSTEM,
		payload: newActiveSystem
	}
}
export function setActiveSystemToCourscant() {
	return {
		type: Actions.SET_SYSTEM_TO_CORUSCANT
	}
}
export function setActiveSystemError(error) {
	return {
		type: Actions.SET_SYSTEM_ERROR,
		payload: error
	}
}
export function zoomOneCloserToActiveSystem() {
	return {
		type: Actions.INCREMENT_SYSTEM_ZOOM
	}
}
export function zoomOneFurtherFromActiveSystem() {
	return {
		type: Actions.DECREMENT_SYSTEM_ZOOM
	}
}
export function setZoomValueOnActiveSystem(newZoom) {
	return {
		type: Actions.SET_SYSTEM_ZOOM_VALUE,
		payload: newZoom
	}
}




export function setMapCenter(newCenter) {
	return {
		type: Actions.SET_MAP_CENTER,
		payload: newCenter
	}
}
export function setMapZoom(newZoom) {
	return {
		type: Actions.SET_MAP_ZOOM,
		payload: newZoom
	}
}
export function setMapCenterAndZoom(newCenter, newZoom) {
	return {
		type: Actions.SET_MAP_CENTER_AND_ZOOM,
		payload: {
			center: newCenter,
			zoom: newZoom
		}
	}
}
export function setMapToZeroZero() {
	return {
		type: Actions.SET_MAP_CENTER_AND_ZOOM_TO_DEFAULT
	}
}
export function setMapError(error) {
	return {
		type: Actions.SET_MAP_ERROR,
		payload: error
	}
}
export function increaseMapZoom() {
	return {
		type: Actions.INCREASE_MAP_ZOOM_BY_ONE
	}
}
export function decreaseMapZoom() {
	return {
		type: Actions.DECREASE_MAP_ZOOM_BY_ONE
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
