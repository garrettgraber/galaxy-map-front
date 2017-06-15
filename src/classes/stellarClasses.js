


class MyClass {
  constructor({a,b} = {a:1,b:2}) {
    this.a = a;
    this.b = b;
  }
}



class Planet {
	// constructor(system, sector, region, coordinates, xGalactic = 0, yGalactic = 0, xGalacticLong = 0, yGalacticLong = 0, hasLocation = false, LngLat = [], zoom = 5, link = '', textWidth = 0) {


	constructor( {_id='', system='', sector='', region='', coordinates='', xGalactic=0, yGalactic=0, xGalacticLong=0, yGalacticLong=0, hasLocation=false, LngLat=[], zoom=0, link='', textWidth=0}    =  {} ) {

	// constructor({system , sector, region, coordinates, xGalactic, yGalactic, xGalacticLong,yGalacticLong, hasLocation, LngLat, zoom, link, textWidth} =  ) {

		this._id = _id;
		this.system = system;
		this.sector = sector;
		this.region = region;
		this.coordinates = coordinates;
		this.xGalactic = xGalactic;
		this.yGalactic = yGalactic;
		this.xGalacticLong = xGalacticLong;
		this.yGalacticLong = yGalacticLong;
		this.hasLocation = hasLocation;
		this.LngLat = LngLat;
		this.lng = (LngLat.length)? LngLat[0] : null;
		this.lat = (LngLat.length)? LngLat[1] : null;
		this.zoom = zoom;
		this.link = link;
		this.textWidth = textWidth;
	}



	starInMapView(map, mapWidth, mapHeight, MapBoundaries) {

	    // console.log("mapHeight in ObjectInMapView: ", mapHeight);
	    // console.log("mapWidth in ObjectInMapView: ", mapWidth);

	    const CurrentMapBoundaries = map.getBounds();

	    // console.log("MapBoundaries: ", MapBoundaries);
	    // console.log("stellarObject: ", stellarObject);
	    const mapOffSetLng = 0;
	    const mapOffSetLat = 0;

	    // const inNorthSouthRange = (CurrentMapBoundaries._southWest.lat - mapOffSetLat < stellarObject.latLng.lat && stellarObject.latLng.lat < CurrentMapBoundaries._northEast.lat + mapOffSetLat) ? true : false;
	    // const inEastWestRange = (CurrentMapBoundaries._southWest.lng - mapOffSetLng < stellarObject.latLng.lng && stellarObject.latLng.lng < CurrentMapBoundaries._northEast.lng + mapOffSetLng) ? true : false;

	    const inNorthSouthRange = (MapBoundaries.south < this.lat && this.lat < MapBoundaries.north) ? true : false;
	    const inEastWestRange = (MapBoundaries.west< this.lng && this.lng < MapBoundaries.east) ? true : false;
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



	starIsVisible(currentZoom) {

		let starIsViewableAtZoom = false;

		// console.log("this.zoom in starIsVisible:  ", this.zoom);
		// console.log("starIsVisible currentZoom: ", currentZoom);


		// switch(this.zoom) {

	 //        case(this.zoom === 0):
	 //        	starIsViewableAtZoom = true;
	 //        	break;
	 //        case((this.zoom === 1 || this.zoom === 2) && currentZoom >= 3):
	 //        	starIsViewableAtZoom = true;
	 //        	break;

	 //        case(this.zoom === 3 && currentZoom >= 4):
	 //        	starIsViewableAtZoom = true;
	 //        	break;

	 //        case(this.zoom >= 4 && currentZoom >= 5):
	 //        	starIsViewableAtZoom = true;
	 //        	break;

	 //        case(this.zoom >= 0 && currentZoom >=6):
	 //        	starIsViewableAtZoom = true;
	 //        	break;

	 //        default:
	 //        	starIsViewableAtZoom = false;
	 //        	break;
		// }


		// // console.log("star is viewable at zoom: ", starIsViewableAtZoom);

		// return starIsViewableAtZoom;




        if(this.zoom === 0) {

			starIsViewableAtZoom = true;

        } else if(this.zoom === 1 && currentZoom >= 3) {

        	starIsViewableAtZoom = true;

        } else if(this.zoom === 2 && currentZoom >= 5) {

        	starIsViewableAtZoom = true;

        } else if(this.zoom === 3 && currentZoom >= 6) {

        	starIsViewableAtZoom = true;

        } else {

        	starIsViewableAtZoom = false;
        }


        return starIsViewableAtZoom;

    }


	galaticXYtoMapPoints(xGalactic, yGalactic) {

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


	planetIsAtZoomLevel(zoom) {

		let atZoomLevel = false;

		switch(this.zoom) {

            case 0:

               atZoomLevel = true;
               break;

            case (this.zoom === 1 && zoom >= 3): 
               atZoomLevel = true;
               break;


            case (this.zoom === 2 && zoom >= 5): 

               atZoomLevel = true;

               break;

            case (this.zoom === 3 && zoom >= 6): 
               atZoomLevel = true;

               break;


			default:

				atZoomLevel = false;

		}

		return atZoomLevel;

	}




};

module.exports.Planet = Planet;



class HyperSpaceLane {
	constructor(hyperspace, start, end, startCoords, endCoords, length, link, Start, End) {
		this.hyperspace = hyperspace || "No Name";
		this.start = start;
		this.end = end;
		this.startCoords = startCoords;
		this.endCoords = endCoords;
		this.length = length;
		this.link = link || "No Link";
		this.Start = Start;
		this.End = End;
	}
};

module.exports.HyperSpaceLane = HyperSpaceLane;