import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import _ from 'lodash';


import { Planet, HyperSpaceLane }from '../classes/stellarClasses.js';
import { 
    searchSystemsFinish,
    getZoomValue,
    setZoomValue,
    renderMapOn,
    renderMapOff,
    renderMapStatus,
    zoomChangeStatus,
    zoomChangeOff
} from '../actions/actionCreators.js';


// import ReactFauxDOM from 'react-faux-dom';


console.log("Planet: ", Planet);
console.log("HyperSpaceLane: ", HyperSpaceLane);

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
            StarMapComponents: [],
        	starDataLoaded: false,
            GalacticPlanetsArray: [],
            GalacticPlanetsSet: new Set(),
            previousIntersectionMap: new Set(),
            PlanetarySystemArray: [],
            zoom: 2
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

                const PlanetsArray = [];

                // console.log("StarData: ", StarData);

	    		for(let i=0; i < StarData.length; i++) {

					const textWidth = width(StarData[i].system, {
			            size: "1em"
			        });

                    // console.log("textWidth: ", textWidth);
                    const currentStar = StarData[i];
                    currentStar.textWidth = textWidth + 0.5;
                    delete currentStar.__v;

                    const CurrentSystem = new Planet(currentStar);

                    // console.log("\nCurrentSystem: ", CurrentSystem);

                    PlanetsArray.push(CurrentSystem);

                    currentStar.starInMapView = Planet.prototype.starInMapView;
                    currentStar.galaticXYtoMapPoints = Planet.prototype.galaticXYtoMapPoints;
                    currentStar.planetIsAtZoomLevel = Planet.prototype.planetIsAtZoomLevel;
                    currentStar.starIsVisible = Planet.prototype.starIsVisible;


                    // console.log("currentStar: ", currentStar);

	    		}

                // const StarComponents = createStarMap(StarData, that.props.zoom, that.props.map);

                // console.log("StarComponents: ", StarComponents);

                // that.setState({StarComponents: StarComponents});

                const galacticPlanetsSet = new Set(PlanetsArray);

                console.log("Galactic Planets Set: ", galacticPlanetsSet);

	    		that.setState({starData: StarData}); 

                that.setState({GalacticPlanetsArray: PlanetsArray});

                that.setState({GalacticPlanetsSet: galacticPlanetsSet});

                const StarMapComponents = that.createStarMap();
                that.setState({StarMapComponents: StarMapComponents});

	    		that.setState({starDataLoaded: true});


	    	});

    }


    componentWillReceiveProps(newProps) {

    	// console.log("Props update StarMap: ", newProps);
     
          // this.setState({zoomLevel: currentZoom});


        console.log("\nZoom in StarMap: ", this.props.zoom);
        const currentZoom = this.props.map.getZoom();
        console.log("currentZoom: ", newProps.zoom);

        if(this.props.zoom !== this.state.zoom) {

            console.log("Zoom change: ", this.props.zoom);
        }

        this.setState({zoom: this.props.zoom});



    }



    createStarMap() {

        console.log("\n\n\n****StarMap creation!****");

        const currentZoom = this.props.zoom;
        const currentMap = this.props.map;
        console.log("+++++Zoom at Star Creation: ", currentZoom);

        const zoomLevelBasedRendering = true;
        const starSystemArray = [];
        let starSystemTempArray = [];
        const CurrentMapBoundaries = currentMap.getBounds();
        const mapWidth = CurrentMapBoundaries._northEast.lng - CurrentMapBoundaries._southWest.lng;
        const mapHeight = CurrentMapBoundaries._northEast.lat - CurrentMapBoundaries._southWest.lat;

        let InViewSystems = 0;
        let mapPaddingHeight = 0;
        let mapPaddingWidth = 0;


        // console.log("starData: ", this.state.starData);

        // console.log("Galactic Planets: ", this.state.GalacticPlanetsArray);
        // console.log("this.props.zoom: ", this.props.zoom);

        // console.log("createStarMap...");
        // console.log("map.getBounds(): ", map.getBounds());
        // console.log("MapBoundariesMax: ", MapBoundariesMax);
 


        // console.log("CurrentMapBoundaries: ", CurrentMapBoundaries);

        // console.log("mapWidth: ", mapWidth);
        // console.log("mapHeight: ", mapHeight);


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



        // console.log("MapBoundaries: ", MapBoundaries);

        // console.log("northernBoundary: ", northernBoundary);

        // console.log("southernBoundary: ", southernBoundary);

        // console.log("easternBoundary: ", easternBoundary);
        // console.log("westernBoundary: ", westernBoundary);


        let starsCurrentlyInView = _.filter(this.state.GalacticPlanetsArray, e => { 
            return e.starInMapView(currentMap, mapWidth, mapHeight, MapBoundaries) === true; 
        });

        // let starsAtZoomLevel = _.filter(this.state.GalacticPlanetsArray, e => { 
        //     return e.planetIsAtZoomLevel(currentZoom) === true; 
        // });

        let starsCurrentlyVisible = _.filter(this.state.GalacticPlanetsArray, e => { 
            // console.log("Star is currently in view: ", e);
            // console.log("starVisible: ", starVisible);
            return e.starIsVisible(currentZoom) === true; 
        });



        const starsInViewSet = new Set(starsCurrentlyInView);
        const starsVisible = new Set(starsCurrentlyVisible);


        let union = new Set([...starsInViewSet, ...starsVisible]);


        let intersectionMap = new Set([...starsInViewSet].filter(x => starsVisible.has(x)));




        // console.log("starsCurrentlyInView: ", starsCurrentlyInView);
        // console.log("starsAtZoomLevel: ", starsAtZoomLevel);
        // console.log("starsCurrentlyVisible: ", starsCurrentlyVisible);
        // console.log("GalacticPlanetsSet: ", this.state.GalacticPlanetsSet);
        // console.log("starsInViewSet: ", starsInViewSet);
        // console.log("starsVisible: ", starsVisible);
        // console.log("union: ", union);
        console.log("intersectionMap: ", intersectionMap);
        console.log("previousIntersectionMap: ", this.state.previousIntersectionMap);

        this.setState({previousIntersectionMap: intersectionMap});




        const starMapsEqual = eqSet(intersectionMap, this.state.previousIntersectionMap);
        const unionOfIntersections = new Set([...intersectionMap, ...this.state.previousIntersectionMap]);


        console.log("Equal to previous star maps: ", starMapsEqual);
        console.log("unionOfIntersections: ", unionOfIntersections);


        intersectionMap.forEach(function(PlanetarySystem, sameItem) {

            if(!PlanetarySystem.hasOwnProperty('latLng')) {

                if(PlanetarySystem.lat === null && PlanetarySystem.lng === null) {

                    // console.log("currentStar data has lat: ", currentStarData.lat);

                    const starLngLat = PlanetarySystem.LngLat;

                    const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
                    // console.log("currentLatLng: ", currentLatLng);
                    PlanetarySystem['lat'] = currentLatLng[1];
                    PlanetarySystem['lng'] = currentLatLng[0];

                    PlanetarySystem[i].latLng = currentLatLng;

                } else {

                    const currentLatLng = L.latLng(PlanetarySystem.lat, PlanetarySystem.lng);
                    // console.log("currentLatLng: ", currentLatLng);
                    PlanetarySystem.latLng = currentLatLng;


                }

            }


            // console.log("PlanetarySystem: " + typeof PlanetarySystem);

            starSystemTempArray.push( <StarSystem key={PlanetarySystem.system} StarObject={PlanetarySystem} zoom={currentZoom} map={currentMap} labels={true}  /> );

            starSystemArray.push(PlanetarySystem);



        });  



        if(false) {





            for(let i=0; i < this.state.starData.length; i++) {


                let currentStarData = this.state.starData[i];



                // let currentStarData = starsCurrentlyInView[i];

                // console.log("currentStarData: ", currentStarData);
                // console.log("Current i: ", i);

                if(!currentStarData.hasOwnProperty('latLng')) {

                    if(currentStarData.lat === null && currentStarData.lng === null) {

                        // console.log("currentStar data has lat: ", currentStarData.lat);

                        const starLngLat = currentStarData.LngLat;

                        const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
                        // console.log("currentLatLng: ", currentLatLng);
                        this.state.starData['lat'] = currentLatLng[1];
                        this.state.starData['lng'] = currentLatLng[0];

                        this.state.starData[i].latLng = currentLatLng;

                    } else {

                        const currentLatLng = L.latLng(currentStarData.lat, currentStarData.lng);
                        // console.log("currentLatLng: ", currentLatLng);
                        this.state.starData[i].latLng = currentLatLng;


                    }

                }




                let objectInView = currentStarData.starInMapView(this.props.map, mapWidth, mapHeight, MapBoundaries);

                if(zoomLevelBasedRendering && objectInView) {


                    if(currentStarData.zoom === 0) {

                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true} /> );


                        starSystemArray.push(currentStarData);

                    }



                    if(currentStarData.zoom === 1 && currentZoom >= 3) {


                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );

                        starSystemArray.push(currentStarData);

                    }

                    // console.log("Star Found! ", starData[i]);

                   // const objectInvView = ObjectInMapView(starData[i], map);

                   //  if(objectInvView) {

                        // console.log("objectInView: ", objectInView);



                   //  }
                


                    // if(currentStarData.zoom === 0) {

                    //     starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true} /> );

                    // }



                    // if(currentStarData.zoom === 1 && currentZoom >= 3) {


                    //     starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );


                    // }

                    if(currentStarData.zoom === 2 && currentZoom >= 5) {

                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true} /> );

                        starSystemArray.push(currentStarData);


                    }

                    if(currentStarData.zoom === 3 && currentZoom >= 6) {

                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );

                        starSystemArray.push(currentStarData);

                    }


                } else if (!zoomLevelBasedRendering && objectInView)  {

                    starSystemTempArray.push( <StarSystem key={this.state.starData[i].system + "|x:" + this.state.starData[i].xGalactic +  "|y:" + this.state.starData[i].yGalactic} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );

                        starSystemArray.push(currentStarData);

                }



            }

        }

            
        // // this.props.dispatch( renderMapOff() );

        // // console.log("State after render: ", this.props);
        // // console.log("Star Systems rendered: ", starSystemTempArray.length);



        console.log("Star Systems rendered: ", starSystemArray.length);

        // console.log("zoom: ", currentZoom);


        const starSystemSet = new Set(starSystemArray);

        let intersectionOnCreation = new Set([...starSystemSet].filter(x => intersectionMap.has(x)));

        let unionOnCreation = new Set([...starsInViewSet, ...intersectionMap]);

        // console.log("intersection of two sets: ", intersectionOnCreation);

        // console.log("union of two sets: ", unionOnCreation);

        console.log("intersectionMap from above: ", intersectionMap);

        console.log("Star System render: ", starSystemSet);

        console.log("****StarMap Completed!****");

        // const starMapsEqual = eqSet(intersectionMap, starSystemSet);

        // console.log("star maps equal: ", starMapsEqual);

        console.log("\n\n");


        return starSystemTempArray;

    }



    componentWillReceiveProps(newProps) {



        this.props.dispatch( zoomChangeStatus() );

        // console.log("Props update MapMain: ", newProps);

        let StarMapComponents = [];

        // StarMapComponents = this.createStarMap();
        // this.setState({StarMapComponents: StarMapComponents});

        // console.log("Rendering map has fired: ", this.props.renderMap);
        // console.log("Zooming the map has fired: ", this.props.zoomChange);


        if(this.props.renderMap ||  this.props.zoomChange) {

            StarMapComponents = this.createStarMap();
            this.setState({StarMapComponents: StarMapComponents});

            console.log("Rendering map has fired: ", this.props.renderMap);
            console.log("Zooming the map has fired: ", this.props.zoomChange);

            // this.props.dispatch( renderMapOff() );

        } else {

            StarMapComponents = this.state.StarMapComponents;
        }

        // StarMapComponents = this.createStarMap();
        console.log("Number of StarMapComponents in newProps: ", StarMapComponents.length);


    }    



    render() {

    	const zIndex = 290;
        // let StarMapComponents = [];

        console.log("this.props.render: ", this.props);
        console.log("this.props.mapMove: ", this.props.mapMove);
        console.log("this.props.zoom: ", this.props.zoom);
        



        // let StarMapComponents =  null;


        // if(this.props.renderMap) {

        //     StarMapComponents = this.createStarMap();

        // } else {

        //     StarMapComponents = StarMapComponents;
        // }

        const StarMapComponents = this.state.StarMapComponents;
        console.log("\n\nStarMapComponents in render: ", StarMapComponents.length);

        if(this.props.mapMove) {

            console.log("map move is rendering the map\n\n");


        } else if(this.props.zoomChange) {

            console.log("zoomChange hasfired map\n\n");
        } else {

            console.log("Something besides map move and zoom is rendering the map: ", this.props);
        }





    	return (

    		<Pane name="star-pane" style={{zIndex: zIndex}}>

				<FeatureGroup  onZoomend={e => this.onZoomend(e)}   >  

                    { this.state.StarMapComponents }

				</FeatureGroup>
	    		
    		</Pane>

    	)

    }

}



// { ( this.state.starDataLoaded === true  || this.props.mapMove === true || this.props.zoom === 2)  && this.createStarMap()  }
// { this.state.starDataLoaded === true && createStarMap(this.state.starData, this.props.zoom, this.props.map) }



// function createStarMap(starData, currentZoom, map) {

//     console.log("starData: ", starData);

//     // console.log("createStarMap...");
//     // console.log("map.getBounds(): ", map.getBounds());
//     // console.log("MapBoundariesMax: ", MapBoundariesMax);
//     console.log("Zoom at Star Creation: ", currentZoom);

//     const CurrentMapBoundaries = map.getBounds();

//     // console.log("CurrentMapBoundaries: ", CurrentMapBoundaries);

//     const mapWidth = CurrentMapBoundaries._northEast.lng - CurrentMapBoundaries._southWest.lng;
//     const mapHeight = CurrentMapBoundaries._northEast.lat - CurrentMapBoundaries._southWest.lat;

//     // console.log("mapWidth: ", mapWidth);
//     // console.log("mapHeight: ", mapHeight);

//     let mapPaddingHeight = 0;
//     let mapPaddingWidth = 0;

//     // console.log("map.getBounds(): ", map.getBounds());
//     // console.log("MapBoundariesMax: ", MapBoundariesMax);

//     if (currentZoom <= 2) {

//         // console.log("Leaving Bounds!");


//     } else if (currentZoom === 3){

//         mapPaddingWidth = 50;
//         mapPaddingHeight = 25;


//     } else if (currentZoom == 4) {


//         mapPaddingWidth = 10;
//         mapPaddingHeight = 5;
//     }


//     const mapOffSetLat = mapPaddingHeight;
//     const mapOffSetLng = mapPaddingWidth;


//     const southernBoundary = CurrentMapBoundaries._southWest.lat - mapOffSetLat;
//     const northernBoundary = CurrentMapBoundaries._northEast.lat + mapOffSetLat
//     const westernBoundary = CurrentMapBoundaries._southWest.lng - mapOffSetLng;
//     const easternBoundary = CurrentMapBoundaries._northEast.lng + mapOffSetLng;
//     const MapBoundaries = {
//         north: northernBoundary,
//         south: southernBoundary,
//         east: easternBoundary,
//         west: westernBoundary
//     };



//     console.log("MapBoundaries: ", MapBoundaries);

//     // console.log("northernBoundary: ", northernBoundary);

//     // console.log("southernBoundary: ", southernBoundary);

//     // console.log("easternBoundary: ", easternBoundary);
//     // console.log("westernBoundary: ", westernBoundary);



//     const starSystemTempArray = [];
//     let InViewSystems = 0;

//     const zoomLevelBasedRendering = true;

//     for(let i=0; i < starData.length; i++) {

//     	const currentStarData = starData[i];
//         // console.log("Current i: ", i);

//     	if(!currentStarData.hasOwnProperty('latLng')) {

//             if(currentStarData.lat === null && currentStarData.lng === null) {

//                 console.log("currentStar data has lat: ", currentStarData.lat);

//     			const starLngLat = currentStarData.LngLat;

//     	    	const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
//                 // console.log("currentLatLng: ", currentLatLng);
//                 starData['lat'] = currentLatLng[1];
//                 starData['lng'] = currentLatLng[0];

//     	    	starData[i].latLng = currentLatLng;

//             } else {

//                 const currentLatLng = L.latLng(currentStarData.lat, currentStarData.lng);
//                 // console.log("currentLatLng: ", currentLatLng);
//                 starData[i].latLng = currentLatLng;


//             }

//     	}


//         // ObjectInMapView(starData[i], map);

//         let objectInView = ObjectInMapView(starData[i], map, mapWidth, mapHeight, MapBoundaries);



//         if(zoomLevelBasedRendering && objectInView) {

//             // console.log("Star Found! ", starData[i]);

//            // const objectInvView = ObjectInMapView(starData[i], map);

//            //  if(objectInvView) {

//                 // console.log("objectInView: ", objectInView);



//            //  }


//         	if(currentStarData.zoom === 0) {

//     	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true} /> );

//         	}

//         	if(currentStarData.zoom === 1 && currentZoom >= 3) {


//     	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );


//         	}

//         	if(currentStarData.zoom === 2 && currentZoom >= 5) {

//     	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true} /> );


//         	}

//         	if(currentStarData.zoom === 3 && currentZoom >= 6) {

//     	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );

//         	}


//         } else {

//             // console.log("Else has fired...");
//             // starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );

//         }


//     }

//     console.log("starSystemTempArray length: ", starSystemTempArray.length);
//     // console.log("zoom: ", currentZoom);

//     return starSystemTempArray;

// };


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




// function eqSet(as, bs) {
//     if (as.size !== bs.size) return false;
//     for (var a of as) if (!bs.has(a)) return false;
//     return true;
// }



function eqSet(as, bs) {
    return as.size === bs.size && all(isIn(bs), as);
}

function all(pred, as) {
    for (var a of as) if (!pred(a)) return false;
    return true;
}

function isIn(as) {
    return function (a) {
        return as.has(a);
    };
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default StarMap;

export default connect(mapStateToProps)(StarMap);

