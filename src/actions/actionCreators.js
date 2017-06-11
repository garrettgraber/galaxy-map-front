

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

