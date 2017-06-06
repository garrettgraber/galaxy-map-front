import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';

// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import StarSystem from './starSystem.js';

const MapBoundariesMax = {
    latitude: {
        north: 84.0,
        south: -84.0
    },
    longitude: {
        east: 170.0,
        west: -170.0
    }
};



class StarMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	starData: [],
            starsInView: [],
            StarComponents: [],
        	starDataLoaded: false,
        };

    }

    componentDidMount() {

    	// console.log("StarMap has mounted: ", this.props);

    	const that = this;

    	fetch('/api/has-location')  
			.then(function(response) {
		    	return response.json();
			}).then(function(data) {

                // console.log("Star Data Type: ", typeof data);
	    		// console.log("Star Data: ", data);
                const StarData = JSON.parse(data);

                // console.log("StarData: ", StarData);

	    		for(let i=0; i < StarData.length; i++) {

					const textWidth = width(StarData[i].system, {
			            size: "1em"
			        });

                    // console.log("textWidth: ", textWidth);
                    const currentStar = StarData[i];
                    // console.log("currentStar: ", currentStar);
			        currentStar.textWidth = textWidth + 0.5;

	    		}

                // const StarComponents = createStarMap(StarData, that.props.zoom, that.props.map);

                // console.log("StarComponents: ", StarComponents);

                // that.setState({StarComponents: StarComponents});

	    		that.setState({starData: StarData}); 

	    		that.setState({starDataLoaded: true});

	    	});

    }


    componentWillReceiveProps(newProps) {

    	console.log("Props update StarMap: ", newProps);
        // const currentZoom = this.props.map.getZoom();
        console.log("currentZoom: ", newProps.zoom);
          // this.setState({zoomLevel: currentZoom});


    }

    onZoomend(e) {

        // console.log("zoom has ended");
        const currentZoom = this.refs.map.leafletElement.getZoom();
        console.log("Star Map Zoom End: ", this.props.zoom);
        console.log("Map zoom end found from map: ", currentZoom);

    }

    onZoomstart(e) {

        console.log("Map zoom starting...");

    }

    render() {

    	const zIndex = 290;

        // console.log("this.state.starData: ", this.state.starData);


    	return (

    		<Pane name="star-pane" style={{zIndex: zIndex}}>

				<FeatureGroup>

                    { this.state.starDataLoaded === true  && createStarMap(this.state.starData, this.props.zoom, this.props.map) }


				</FeatureGroup>
	    		

    		</Pane>

    	)

    }

}

// { this.state.starDataLoaded === true && createStarMap(this.state.starData, this.props.zoom, this.props.map) }



function createStarMap(starData, currentZoom, map) {

    // console.log("createStarMap...");
    console.log("map.getBounds(): ", map.getBounds());
    // console.log("MapBoundariesMax: ", MapBoundariesMax);
    console.log("currentZoom: ", currentZoom);

    const CurrentMapBoundaries = map.getBounds();

    console.log("CurrentMapBoundaries: ", CurrentMapBoundaries);

    const mapWidth = CurrentMapBoundaries._northEast.lng - CurrentMapBoundaries._southWest.lng;
    const mapHeight = CurrentMapBoundaries._northEast.lat - CurrentMapBoundaries._southWest.lat;

    console.log("mapWidth: ", mapWidth);
    console.log("mapHeight: ", mapHeight);

    let mapPaddingHeight = 0;
    let mapPaddingWidth = 0;

    // console.log("map.getBounds(): ", map.getBounds());
    // console.log("MapBoundariesMax: ", MapBoundariesMax);

    if (currentZoom <= 2) {

        // console.log("Leaving Bounds!");


    } else if (currentZoom === 3){

        mapPaddingWidth = 50;
        mapPaddingHeight = 25;


    } else if (currentZoom == 4) {


        mapPaddingWidth = 10;
        mapPaddingHeight = 5;
    }


    const mapOffSetLat = mapPaddingHeight;
    const mapOffSetLng = mapPaddingWidth;


    const southernBoundary = CurrentMapBoundaries._southWest.lat - mapOffSetLat;
    const northernBoundary = CurrentMapBoundaries._northEast.lat + mapOffSetLat
    const westernBoundary = CurrentMapBoundaries._southWest.lng - mapOffSetLng;
    const easternBoundary = CurrentMapBoundaries._northEast.lng + mapOffSetLng;
    const MapBoundaries = {
        north: northernBoundary,
        south: southernBoundary,
        east: easternBoundary,
        west: westernBoundary
    };



    console.log("MapBoundaries: ", MapBoundaries);

    // console.log("northernBoundary: ", northernBoundary);

    // console.log("southernBoundary: ", southernBoundary);

    // console.log("easternBoundary: ", easternBoundary);
    // console.log("westernBoundary: ", westernBoundary);



    const starSystemTempArray = [];
    let InViewSystems = 0;

    const zoomLevelBasedRendering = true;

    for(let i=0; i < starData.length; i++) {

    	const currentStarData = starData[i];
        // console.log("Current i: ", i);

    	if(!currentStarData.hasOwnProperty('latLng')) {

            if(currentStarData.lat === null && currentStarData.lng === null) {

                console.log("currentStar data has lat: ", currentStarData.lat);

    			const starLngLat = currentStarData.LngLat;

    	    	const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
                // console.log("currentLatLng: ", currentLatLng);
                starData['lat'] = currentLatLng[1];
                starData['lng'] = currentLatLng[0];

    	    	starData[i].latLng = currentLatLng;

            } else {

                const currentLatLng = L.latLng(currentStarData.lat, currentStarData.lng);
                // console.log("currentLatLng: ", currentLatLng);
                starData[i].latLng = currentLatLng;


            }

    	}


        // ObjectInMapView(starData[i], map);

        let objectInView = ObjectInMapView(starData[i], map, mapWidth, mapHeight, MapBoundaries);



        if(zoomLevelBasedRendering && objectInView) {

            // console.log("Star Found! ", starData[i]);

           // const objectInvView = ObjectInMapView(starData[i], map);

           //  if(objectInvView) {

                // console.log("objectInView: ", objectInView);



           //  }


        	if(currentStarData.zoom === 0) {

    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true} /> );

        	}

        	if(currentStarData.zoom === 1 && currentZoom >= 3) {


    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );


        	}

        	if(currentStarData.zoom === 2 && currentZoom >= 5) {

    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true} /> );


        	}

        	if(currentStarData.zoom === 3 && currentZoom >= 6) {

    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );

        	}


        } else {

            // console.log("Else has fired...");
            // starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );

        }


    }

    console.log("starSystemTempArray length: ", starSystemTempArray.length);
    console.log("zoom: ", currentZoom);

    return starSystemTempArray;

};


function ObjectInMapView(stellarObject, map, mapWidth, mapHeight, MapBoundaries) {

 



    // console.log("mapHeight in ObjectInMapView: ", mapHeight);
    // console.log("mapWidth in ObjectInMapView: ", mapWidth);

    const CurrentMapBoundaries = map.getBounds();



    // console.log("MapBoundaries: ", MapBoundaries);
    // console.log("stellarObject: ", stellarObject);
    const mapOffSetLng = 0;
    const mapOffSetLat = 0;

    // const inNorthSouthRange = (CurrentMapBoundaries._southWest.lat - mapOffSetLat < stellarObject.latLng.lat && stellarObject.latLng.lat < CurrentMapBoundaries._northEast.lat + mapOffSetLat) ? true : false;
    // const inEastWestRange = (CurrentMapBoundaries._southWest.lng - mapOffSetLng < stellarObject.latLng.lng && stellarObject.latLng.lng < CurrentMapBoundaries._northEast.lng + mapOffSetLng) ? true : false;



    const inNorthSouthRange = (MapBoundaries.south < stellarObject.latLng.lat && stellarObject.latLng.lat < MapBoundaries.north) ? true : false;
    const inEastWestRange = (MapBoundaries.west - mapOffSetLng < stellarObject.latLng.lng && stellarObject.latLng.lng < MapBoundaries.east) ? true : false;

    // console.log("inNorthSouthRange: ", inNorthSouthRange);
    // console.log("inEastWestRange: ", inEastWestRange);
    // console.log("CurrentMapBoundaries: ", CurrentMapBoundaries);
    // console.log("stellarObject: ", stellarObject);
    const objectInvView = (inNorthSouthRange && inEastWestRange) ? true : false;


    if(objectInvView) {

        // console.log("inNorthSouthRange: ", inNorthSouthRange);
        // console.log("inEastWestRange: ", inEastWestRange);

        // console.log("CurrentMapBoundaries: ", CurrentMapBoundaries);

        // console.log("MapBoundariesMax: ", MapBoundariesMax);

        // console.log("In range: ", stellarObject);

    }

    return objectInvView;



}



function galaticXYtoMapPoints(xGalactic, yGalactic) {

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




const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default StarMap;

export default connect(mapStateToProps)(StarMap);

