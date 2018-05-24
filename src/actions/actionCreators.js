import Actions from '../constants/actionTypesModule.js';


export function zoomToAndPanIsOn() {
	return {
		type: Actions.ZOOM_TO_AND_PAN_ON
	}
}
export function zoomToAndPanIsOff() {
	return {
		type: Actions.ZOOM_TO_AND_PAN_OFF
	}
}
export function zoomIsChaning() {
	return {
		type: Actions.ZOOM_CHANGE_ON
	}
};
export function zoomIsStable() {
	return {
		type: Actions.ZOOM_CHANGE_OFF
	}
}
export function focusSelect() {
	return {
		type: Actions.SELECT_FOCUSED
	}
}
export function blurSelect() {
	return {
		type: Actions.SELECT_BLURRED
	}
}
export function mapShouldDisplayForMobile() {
	return {
		type: Actions.MOBILE_STATUS_ON
	}
}
export function mapShouldDisplayForDesktop() {
	return {
		type: Actions.MOBILE_STATUS_OFF
	}
}
export function newNavigationObjectBoundaries(BoundaryData) {
  return {
    type: Actions.NEW_NAVIGATION_OBJECT_BOUNDARIES,
    payload: BoundaryData
  }
}
export function noNavigationObjectBoundaries() {
  return {
    type: Actions.NO_NAVIGATION_OBJECT_BOUNDARIES
  }
}
export function setSearchValueToSystems() {
	return {
		type: Actions.CURRENT_SEARCH_VALUE_IS_SYSTEMS
	}
}
export function setSearchValueToSectors() {
	return {
		type: Actions.CURRENT_SEARCH_VALUE_IS_SECTORS
	}
}
export function setSearchValueToLanes() {
	return {
		type: Actions.CURRENT_SEARCH_VALUE_IS_LANES
	}
}
export function setSearchValueToNothing() {
	return {
		type: Actions.NO_CURRENT_SEARCH_VALUE
	}
}
export function newSearchObjectBoundaries(BoundaryData) {
	return {
		type: Actions.NEW_SEARCH_OBJECT_BOUNDARIES,
		payload: BoundaryData
	}
}
export function noSearchObjectBoundaries() {
	return {
		type: Actions.NO_SEARCH_OBJECT_BOUNDARIES
	}
}
export function newHyperspaceRoute(RouteData) {
	return {
		type: Actions.NEW_HYPERSPACE_ROUTE_DATA,
		payload: RouteData
	}
}
export function noHyperspaceRoute() {
	return {
		type: Actions.NO_HYPERSPACE_ROUTE_DATA
	}
}
export function newSectorData(SectorData) {
	return {
		type: Actions.NEW_SECTOR_DATA,
		payload: SectorData
	}
}
export function noSectorData() {
	return {
		type: Actions.NO_SECTOR_DATA
	}
}
export function newSystemsLocation(Location) {
	return {
		type: Actions.NEW_SYSTEMS_SEARCH_LOCATION,
		payload: Location
	}
}
export function noSystemsLocation() {
	return {
		type: Actions.NO_SYSTEMS_SEARCH_LOCATION
	}
}
export function sectorMapIsOff() {
	return {
		type: Actions.SECTOR_MAP_OFF
	}
}
export function sectorMapIsOn() {
	return {
		type: Actions.SECTOR_MAP_ON
	}
}
export function starMapIsOff() {
	return {
		type: Actions.STAR_MAP_OFF
	}
}
export function starMapIsOn() {
	return {
		type: Actions.STAR_MAP_ON
	}
}
export function loadingIconOn() {
	return {
		type: Actions.LOADING_ICON_ON
	}
}
export function loadingIconOff() {
	return {
		type: Actions.LOADING_ICON_OFF
	}
}
export function defaultCursor() {
	return {
		type: Actions.CURSOR_DEFAULT
	}
}
export function notAllowedCursor() {
	return {
		type: Actions.CURSOR_NOT_ALLOWED
	}
}
export function pointerCursor() {
	return {
		type: Actions.CURSOR_POINTER
	}
}
export function crosshairCursor() {
	return {
		type: Actions.CURSOR_CROSSHAIR
	}
}
export function newGalacticXandY(newPosition) {
	return {
		type: Actions.MOUSE_MOVE,
		payload: newPosition
	}
}
export function cursorMovesOffMap() {
	return {
		type: Actions.MOUSE_MOVE_OFF_MAP
	}
}
export function cursorMovesOntoMap() {
	return {
		type: Actions.MOUSE_MOVE_ONTO_MAP
	}
}
export function displayMapControls() {
	return {
		type: Actions.DISPLAY_MAP_CONTROLS
	}
}
export function closeMapControls() {
	return {
		type: Actions.HIDE_MAP_CONTROLS
	}
}
export function addSectorSearchSet(sector) {
	return {
		type: Actions.ADD_SECTOR_SEARCH_SET,
		payload: sector
	}
}
export function buildSectorSearchSet(sectorSet) {
	return {
		type: Actions.BUILD_SECTOR_SEARCH_SET,
		payload: sectorSet
	}
}
export function emptySectorSearchSet() {
	return {
		type: Actions.EMPTY_SECTOR_SEARCH_SET
	}
}
export function buildSystemNameSet(nameSet) {
	return {
		type: Actions.BUILD_SYSTEM_NAME_SET,
		payload: nameSet
	}
}
export function emptySystemNameSet() {
	return {
		type: Actions.EMPTY_SYSTEM_NAME_SET
	}
}
export function buildHyperspaceRouteNameSet(nameSet) {
	return {
		type: Actions.BUILD_HYPERSPACE_ROUTE_NAME_SET,
		payload: nameSet
	}
}
export function emptyHyperspaceRouteNameSet() {
	return {
		type: Actions.EMPTY_HYPERSPACE_ROUTE_NAME_SET
	}
}
export function activeStartPosition(StartPosition) {
	return {
		type: Actions.SET_ACTVIE_START_POSITION,
		payload: StartPosition
	}
}
export function activeStartPositionDefault() {
	return {
		type: Actions.SET_ACTVIE_START_POSITION_DEFAULT
	}
}
export function activeEndPosition(EndPosition) {
	return {
		type: Actions.SET_ACTVIE_END_POSITION,
		payload: EndPosition
	}
}
export function activeEndPositionDefault() {
	return {
		type: Actions.SET_ACTVIE_END_POSITION_DEFAULT
	}
}
export function pathStartClickOn() {
	return {
		type: Actions.PATH_START_CLICK_ON
	}
}
export function pathStartClickOff() {
	return {
		type: Actions.PATH_START_CLICK_OFF
	}
}
export function pathStartClickToggle() {
	return {
		type: Actions.PATH_START_CLICK_TOGGLE
	}
}
export function pathEndClickOn() {
	return {
		type: Actions.PATH_END_CLICK_ON
	}
}
export function pathEndClickOff() {
	return {
		type: Actions.PATH_END_CLICK_OFF
	}
}
export function pathEndClickToggle() {
	return {
		type: Actions.PATH_END_CLICK_TOGGLE
	}
}
export function activeStartNode(StartNode) {
	return {
		type: Actions.SET_ACTVIE_START_NODE,
		payload: StartNode
	}
}
export function activeStartNodeDefault() {
	return {
		type: Actions.SET_ACTVIE_START_NODE_DEFAULT
	}
}
export function activeEndNode(EndNode) {
	return {
		type: Actions.SET_ACTVIE_END_NODE,
		payload: EndNode
	}
}
export function activeEndNodeDefault() {
	return {
		type: Actions.SET_ACTVIE_END_NODE_DEFAULT
	}
}
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
export function setDefaultActiveSystem() {
	return {
		type: Actions.SET_DEFAULT_SYSYTEM
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
export function setMapToZeroZeroZoomOne() {
	return {
		type: Actions.SET_MAP_CENTER_AND_ZOOM_TO_ONE
	}
}
export function setMapError(error) {
	return {
		type: Actions.SET_MAP_ERROR,
		payload: error
	}
}
export function zoomPointOn(){
	return {
		type: Actions.HYPERSPACE_POINT_ZOOM_ON
	}
}
export function zoomPointOff(){
	return {
		type: Actions.HYPERSPACE_POINT_ZOOM_OFF
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
export function setDefaultStartPosition() {
	return {
		type: Actions.SET_DEFAULT_START_POSITION
	}
}
export function setDefaultEndPosition() {
	return {
		type: Actions.SET_DEFAULT_END_POSITION
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
export function setDefaultStartNode() {
	return {
		type: Actions.SET_DEFAULT_START_NODE
	}
}
export function setDefaultEndNode() {
	return {
		type: Actions.SET_DEFAULT_END_NODE
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
	return { 
		type: Actions.SET_START_SYSTEM,
		payload: system
	}	
}
export function setEndSystem(system) {
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
export function baseMapIsGalaxy() {
	return {
		type: Actions.BASE_LAYER_GALAXY
	}
}
export function baseMapIsBlack() {
	return {
		type: Actions.BASE_LAYER_BLACK
	}
}
export function baseMapIsWhite() {
	return {
		type: Actions.BASE_LAYER_WHITE
	}
}