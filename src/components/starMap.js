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
            zoomLevel: 2
        };

    }

    componentDidMount() {

    	// console.log("StarMap has mounted: ", this.props);
    	console.log("StarMap this.refs: ", this.refs);
          const startZoom = this.props.map.getZoom();
          console.log("startZoom: ", startZoom);
          this.setState({zoomLevel: startZoom});

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
        const currentZoom = this.props.map.getZoom();
        console.log("currentZoom: ", currentZoom);
          this.setState({zoomLevel: currentZoom});


    }

    onZoomend(e) {

        // console.log("zoom has ended");
        const currentZoom = this.refs.map.leafletElement.getZoom();
        console.log("New Zoom: ", currentZoom);
        this.setState({zoom: currentZoom});
        console.log("Map zoom end: ", currentZoom);

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

                    { this.state.starDataLoaded === true  && createStarMap(this.state.starData, this.state.zoomLevel, this.props.map) }


				</FeatureGroup>
	    		

    		</Pane>

    	)

    }

}

// { this.state.starDataLoaded === true && createStarMap(this.state.starData, this.props.zoom, this.props.map) }



function createStarMap(starData, currentZoom, map) {

    // console.log("createStarMap...");
    // console.log("map.getBounds(): ", map.getBounds());
    // console.log("MapBoundariesMax: ", MapBoundariesMax);
    console.log("currentZoom: ", currentZoom);

    const starSystemTempArray = [];
    let InViewSystems = 0;

    const zoomLevelBasedRendering = true;

    for(let i=0; i < starData.length; i++) {

    	const currentStarData = starData[i];
        // console.log("Current i: ", i);

    	if(!currentStarData.hasOwnProperty('latLng')) {

			const starLngLat = currentStarData.LngLat;

	    	const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
            // console.log("currentLatLng: ", currentLatLng);
            starData['lat'] = currentLatLng[1];
            starData['lng'] = currentLatLng[0];

	    	starData[i].latLng = currentLatLng;

    	}

        // ObjectInMapView(starData[i], map);

        let objectInView = ObjectInMapView(starData[i], map);



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


function ObjectInMapView(stellarObject, map) {

    // console.log("map.getBounds(): ", map.getBounds());
    // console.log("MapBoundariesMax: ", MapBoundariesMax);

    const CurrentMapBoundaries = map.getBounds();

    // console.log("CurrentMapBoundaries: ", CurrentMapBoundaries);
    // console.log("stellarObject: ", stellarObject);
    const inNorthSouthRange = (CurrentMapBoundaries._southWest.lat < stellarObject.latLng.lat && stellarObject.latLng.lat < CurrentMapBoundaries._northEast.lat) ? true : false;
    const inEastWestRange = (CurrentMapBoundaries._southWest.lng < stellarObject.latLng.lng && stellarObject.latLng.lng < CurrentMapBoundaries._northEast.lng) ? true : false;

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

