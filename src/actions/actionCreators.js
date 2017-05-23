

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


