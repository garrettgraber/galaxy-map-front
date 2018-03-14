const Actions = {
	NEW_NAVIGATION_OBJECT_BOUNDARIES: 'NEW_NAVIGATION_OBJECT_BOUNDARIES',
	NO_NAVIGATION_OBJECT_BOUNDARIES: 'NO_NAVIGATION_OBJECT_BOUNDARIES',

	CURRENT_SEARCH_VALUE_IS_SYSTEMS: 'CURRENT_SEARCH_VALUE_IS_SYSTEMS',
	CURRENT_SEARCH_VALUE_IS_SECTORS: 'CURRENT_SEARCH_VALUE_IS_SECTORS',
	CURRENT_SEARCH_VALUE_IS_LANES: 'CURRENT_SEARCH_VALUE_IS_LANES',
	NO_CURRENT_SEARCH_VALUE: 'NO_CURRENT_SEARCH_VALUE',

	NEW_SEARCH_OBJECT_BOUNDARIES: 'NEW_SEARCH_OBJECT_BOUNDARIES',
	NO_SEARCH_OBJECT_BOUNDARIES: 'NO_SEARCH_OBJECT_BOUNDARIES',

	NEW_HYPERSPACE_ROUTE_DATA: 'NEW_HYPERSPACE_ROUTE_DATA',
	NO_HYPERSPACE_ROUTE_DATA: 'NO_HYPERSPACE_ROUTE_DATA',

	NEW_SECTOR_DATA: 'NEW_SECTOR_DATA',
	NO_SECTOR_DATA: 'NO_SECTOR_DATA',

	NEW_SYSTEMS_SEARCH_LOCATION: 'NEW_SYSTEMS_SEARCH_LOCATION',
	NO_SYSTEMS_SEARCH_LOCATION: 'NO_SYSTEMS_SEARCH_LOCATION',

	SECTOR_MAP_ON: 'SECTOR_MAP_ON',
	SECTOR_MAP_OFF: 'SECTOR_MAP_OFF',

	STAR_MAP_ON: 'STAR_MAP_ON',
	STAR_MAP_OFF: 'STAR_MAP_OFF',
	
	LOADING_ICON_ON: 'LOADING_ICON_ON',
	LOADING_ICON_OFF: 'LOADING_ICON_OFF',

	CURSOR_DEFAULT: 'CURSOR_DEFAULT',
	CURSOR_NOT_ALLOWED: 'CURSOR_NOT_ALLOWED',
	CURSOR_CROSSHAIR: 'CURSOR_CROSSHAIR',
	CURSOR_POINTER: 'CURSOR_POINTER',

	MOUSE_MOVE: 'MOUSE_MOVE',
	MOUSE_MOVE_ONTO_MAP: 'MOUSE_MOVE_ONTO_MAP',
	MOUSE_MOVE_OFF_MAP: 'MOUSE_MOVE_OFF_MAP',

	DISPLAY_MAP_CONTROLS: 'DISPLAY_MAP_CONTROLS',
	HIDE_MAP_CONTROLS: 'HIDE_MAP_CONTROLS',
	
	ADD_SECTOR_SEARCH_SET: 'ADD_SECTOR_SEARCH_SET',
	BUILD_SECTOR_SEARCH_SET: 'BUILD_SECTOR_SEARCH_SET',
	EMPTY_SECTOR_SEARCH_SET: 'EMPTY_SECTOR_SEARCH_SET',

	BUILD_SYSTEM_NAME_SET: 'BUILD_SYSTEM_NAME_SET',
	EMPTY_SYSTEM_NAME_SET: 'EMPTY_SYSTEM_NAME_SET',

	BUILD_HYPERSPACE_ROUTE_NAME_SET: 'BUILD_HYPERSPACE_ROUTE_NAME_SET',
	EMPTY_HYPERSPACE_ROUTE_NAME_SET: 'EMPTY_HYPERSPACE_ROUTE_NAME_SET',

	PATH_START_CLICK_ON: 'PATH_START_CLICK_ON',
	PATH_START_CLICK_OFF: 'PATH_START_CLICK_OFF',
	PATH_START_CLICK_TOGGLE: 'PATH_START_CLICK_TOGGLE',

	PATH_END_CLICK_ON: 'PATH_END_CLICK_ON',
	PATH_END_CLICK_OFF: 'PATH_END_CLICK_OFF',
	PATH_END_CLICK_TOGGLE: 'PATH_END_CLICK_TOGGLE',

	SET_ACTVIE_START_NODE: 'SET_ACTVIE_START_NODE',
	SET_ACTVIE_START_NODE_DEFAULT: 'SET_ACTVIE_START_NODE_DEFAULT',

	SET_ACTVIE_END_NODE: 'SET_ACTVIE_END_NODE',
	SET_ACTVIE_END_NODE_DEFAULT: 'SET_ACTVIE_END_NODE_DEFAULT',

	HYPERSPACE_POINT_ZOOM_ON: "HYPERSPACE_POINT_ZOOM_ON",
	HYPERSPACE_POINT_ZOOM_OFF: "HYPERSPACE_POINT_ZOOM_OFF",
	
	SET_ACTVIE_START_POSITION: "SET_ACTVIE_START_POSITION",
	SET_ACTVIE_START_POSITION_DEFAULT: "SET_ACTVIE_START_POSITION_DEFAULT",

	SET_ACTVIE_END_POSITION: "SET_ACTVIE_END_POSITION",
	SET_ACTVIE_END_POSITION_DEFAULT: "SET_ACTVIE_END_POSITION_DEFAULT",
	
	SET_ACTIVE_HYPERSPACE_JUMP: "SET_ACTIVE_HYPERSPACE_JUMP",
	SET_NULL_ACTIVE_HYPERSPACE_JUMP: "SET_NULL_ACTIVE_HYPERSPACE_JUMP",

	SET_SELECTED_HYPERSPACE_HASH: "SET_SELECTED_HYPERSPACE_HASH",
	SET_NULL_HYPERSPACE_HASH: "SET_NULL_HYPERSPACE_HASH",


	UPDATE_NORTH_EAST_MAP_HASH: "UPDATE_NORTH_EAST_MAP_HASH",
	UPDATE_SOUTH_WEST_MAP_HASH: "UPDATE_SOUTH_WEST_MAP_HASH",
	CLEAR_NORTH_EAST_MAP_HASH: "CLEAR_NORTH_EAST_MAP_HASH",
	CLEAR_SOUTH_WEST_MAP_HASH: "CLEAR_SOUTH_WEST_MAP_HASH",


	ADD_DATA_STREAM_ITEM : "ADD_DATA_STREAM_ITEM",
	SET_CURRENT_DATA_STREAM_ITEM_TEMP : "SET_CURRENT_DATA_STREAM_ITEM_TEMP",
	SET_CURRENT_DATA_STREAM_ITEM_TO_MOST_RECENT : "SET_CURRENT_DATA_STREAM_ITEM_TO_MOST_RECENT",
	SET_CURRENT_DATA_STREAM_ITEM_TO_BLANK : "SET_CURRENT_DATA_STREAM_ITEM_TO_BLANK",
	DECODE_ADDITIONAL_LETTER : "DECODE_ADDITIONAL_LETTER",
	RE_ENCODE_PREVIOUS_LETTER : "RE_ENCODE_PREVIOUS_LETTER",
	ZERO_DECODE_LETTERS : "ZERO_DECODE_LETTERS",


	SYSTEMS_SEARCH_CONTROLS_ON : "SYSTEMS_SEARCH_CONTROLS_ON",
	SYSTEMS_SEARCH_CONTROLS_OFF : "SYSTEMS_SEARCH_CONTROLS_OFF",
	SYSTEMS_SEARCH_CONTROLS_TOGGLE : "SYSTEMS_SEARCH_CONTROLS_TOGGLE",

	HYPERSPACE_NAVIGATION_CONTROLS_ON : "HYPERSPACE_NAVIGATION_CONTROLS_ON",
	HYPERSPACE_NAVIGATION_CONTROLS_OFF : "HYPERSPACE_NAVIGATION_CONTROLS_OFF",
	HYPERSPACE_NAVIGATION_CONTROLS_TOGGLE : "HYPERSPACE_NAVIGATION_CONTROLS_TOGGLE",

	SET_SYSTEM : "SET_SYSTEM",
	SET_SYSTEM_ERROR : "SET_SYSTEM_ERROR",
	SET_SYSTEM_TO_CORUSCANT : "SET_SYSTEM_TO_CORUSCANT",
	INCREMENT_SYSTEM_ZOOM : "INCREMENT_SYSTEM_ZOOM",
	DECREMENT_SYSTEM_ZOOM : "DECREMENT_SYSTEM_ZOOM",
	SET_SYSTEM_ZOOM_VALUE : "SET_SYSTEM_ZOOM_VALUE",
	SET_DEFAULT_SYSYTEM : "SET_DEFAULT_SYSYTEM",

	SET_MAP_CENTER : "SET_MAP_CENTER",
	SET_MAP_ZOOM : "SET_MAP_ZOOM",
	SET_MAP_CENTER_AND_ZOOM : "SET_MAP_CENTER_AND_ZOOM",
	SET_MAP_CENTER_AND_ZOOM_TO_DEFAULT : "SET_MAP_CENTER_AND_ZOOM_TO_DEFAULT",
	SET_MAP_ERROR : "SET_MAP_ERROR",
	INCREASE_MAP_ZOOM_BY_ONE : "INCREASE_MAP_ZOOM_BY_ONE",
	DECREASE_MAP_ZOOM_BY_ONE : "DECREASE_MAP_ZOOM_BY_ONE",

	SEARCH_SYSTEMS_ON : "SEARCH_SYSTEMS_ON",
	SEARCH_SYSTEMS_OFF : "SEARCH_SYSTEMS_OFF",

	LOAD_HYPERSPACE_COLLECTION : 'LOAD_HYPERSPACE_COLLECTION',
	EMPTY_HYPERSPACE_COLLECTION : 'EMPTY_HYPERSPACE_COLLECTION',
	ADD_HYPERSPACE_COLLECTION : 'ADD_HYPERSPACE_COLLECTION',
	ERROR_HYPERSPACE_COLLECTION : 'ERROR_HYPERSPACE_COLLECTION',

	HYPERSPACE_PATH_CHANGE_ON : 'HYPERSPACE_PATH_CHANGE_ON',
	HYPERSPACE_PATH_CHANGE_OFF : 'HYPERSPACE_PATH_CHANGE_OFF',
	HYPERSPACE_PATH_CHANGE_STATUS : 'HYPERSPACE_PATH_CHANGE_STATUS',

	PATH_SEARCH_ON : 'PATH_SEARCH_ON',
	PATH_SEARCH_OFF : 'PATH_SEARCH_OFF',

	PATH_SEARCH_START_ON : 'PATH_SEARCH_START_ON',
	PATH_SEARCH_START_OFF : 'PATH_SEARCH_START_OFF',

	PATH_SEARCH_END_ON : 'PATH_SEARCH_END_ON',
	PATH_SEARCH_END_OFF : 'PATH_SEARCH_END_OFF',

	SET_START_POSITION : 'SET_START_POSITION',
	SET_START_POSITION_ERROR : 'SET_START_POSITION_ERROR',
	SET_DEFAULT_START_POSITION: 'SET_DEFAULT_START_POSITION',
	SET_END_POSITION : 'SET_END_POSITION',
	SET_END_POSITION_ERROR : 'SET_END_POSITION_ERROR',
	SET_DEFAULT_END_POSITION: 'SET_DEFAULT_END_POSITION',

	SET_START_NODE : 'SET_START_NODE',
	SET_START_NODE_ERROR : 'SET_START_NODE_ERROR',
	SET_DEFAULT_START_NODE: 'SET_DEFAULT_START_NODE',

	SET_END_NODE : 'SET_END_NODE',
	SET_END_NODE_ERROR : 'SET_END_NODE_ERROR',
	SET_DEFAULT_END_NODE: 'SET_DEFAULT_END_NODE',

	CALCULATE_HYPERSPACE_JUMP_ON : 'CALCULATE_HYPERSPACE_JUMP_ON',
	CALCULATE_HYPERSPACE_JUMP_OFF : 'CALCULATE_HYPERSPACE_JUMP_OFF',

	PIN_POINT_START_ON : 'PIN_POINT_START_ON',
	PIN_POINT_START_OFF : 'PIN_POINT_START_OFF',
	PIN_POINT_START_TOGGLE : 'PIN_POINT_START_TOGGLE',

	PIN_POINT_END_ON : 'PIN_POINT_END_ON',
	PIN_POINT_END_OFF : 'PIN_POINT_END_OFF',
	PIN_POINT_END_TOGGLE : 'PIN_POINT_END_TOGGLE',

	SET_START_SYSTEM : 'SET_START_SYSTEM',
	SET_START_SYSTEM_ERROR : 'SET_START_SYSTEM_ERROR',
	SET_START_SYSTEM_EMPTY : 'SET_START_SYSTEM_EMPTY',

	SET_END_SYSTEM : 'SET_END_SYSTEM',
	SET_END_SYSTEM_ERROR : 'SET_END_SYSTEM_ERROR',
	SET_END_SYSTEM_EMPTY : 'SET_END_SYSTEM_EMPTY',

	SET_MAX_JUMPS : 'SET_MAX_JUMPS',
	SET_MAX_JUMPS_ERROR : 'SET_MAX_JUMPS_ERROR',

	GENERATE_MAP_HASH : 'GENERATE_MAP_HASH',
	DEFAULT_MAP_HASH : 'DEFAULT_MAP_HASH',
	SAME_MAP_HASH : 'SAME_MAP_HASH',

	UPDATE_HYPERSPACE_NAVIGATION_ON : 'UPDATE_HYPERSPACE_NAVIGATION_ON',
	UPDATE_HYPERSPACE_NAVIGATION_OFF : 'UPDATE_HYPERSPACE_NAVIGATION_OFF',
};

export default Actions;