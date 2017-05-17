import React from 'react';
import { connect } from 'react-redux';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';


import {coordinateArray} from '../data/stellarCoordinates.js';
import HyperSpaceData from 'json-loader!../data/hyperspace.geojson';
import RegionData from 'json-loader!../data/region.geojson';
import SectorData from 'json-loader!../data/sector.geojson';
import GridData from 'json-loader!../data/grid.geojson';

// import config from '../data/config.json';


const tileServerUrl = 'http://172.17.0.4:8110/tiles-leaflet-7/{z}/{x}/{y}.png';
const awsTileServerUrl = 'https://s3-us-west-2.amazonaws.com/tiledata.sw.map/tiles-leaflet-7/{z}/{x}/{y}.png';

console.log("tileServerUrl: ", tileServerUrl);

// console.log("config: ", config);


// function getTileUrl() {
//     return $.ajax({
//         type: "GET",
//         url: 'api/tile-server-url',
//         async: false
//     }).responseText;
// };
// console.log("HyperSpaceData: ", HyperSpaceData);
// console.log("RegionData: ", RegionData);
// console.log("SectorData: ", SectorData);

// const testPicture2 = require("file-loader?name=[path][name].[ext]!../map-tiles/0/0/0.png");

// requireAll(require.context('../map-tiles/', true, /\.png$/));

// const req = requireAll2(require.context('../map-tiles/', true, /\.png$/));

// const req = requireAll2(require.context('../tiles-leaflet-new/', true, /\.png$/));

// console.log("tiles found in mapBase: ", req);

console.log("L: ", L);


const Coruscant = {
    xGalactic: 0,
    yGalactic: 0,
    system: "Coruscant"
};

const ByssGalactic = {
    x: -721.104796694,
    y: -2731.02043122,
    name: "Byss"
};

const TatooineGalactic = {
    x: 9665.78,
    y: -10099.11,
    name: "Tatooine"
};

const BespinCoordinates = {
    x: -1429.95624641,
    y: -12747.8495758,
    name: "Bespin"
};

const HothCoordinates = {
    x: -1421.32249164,
    y: -12880.3501824,
    name: "Hoth"
};

const MustafarCoordinates = {
    x: 267.847196773,
    y: -14770.1194952,
    name: "Mustafar"
};

const YavinCoordinates = {
    x: 6875.92476962,
    y: 5980.0696169,
    name: "Yavin"
};

const ZiostCoordinates = {
    x: 9269.96402126,
    y: 7777.52608021,
    name: "Ziost"
};

const DantooineCoordinates = {
    x: 14.6985951728,
    y: 8378.26994648,
    name: "Dantooine"
};

const MonCalamari = {
    x: 13608.1237866,
    y: 4951.81460239,
    name: "Mon Calamari"
};

const Kamino = {
    x: 10657.3261869,
    y: -7961.66851518,
    name: "Kamino"
};

const NalHutta = {
    x: 10559.8270861,
    y: -3087.09861004,
    name: "Nal Hutta"
};

const Naboo = {
    x: 5016.62377546,
    y: -10608.4629171,
    name: "Naboo"
};

const Eriadu = {
    x: 2332.54955797,
    y: -12439.671287,
    name: "Eriadu"
};

const Bakura = {
    xGalactic: -6572.36071613,
    yGalactic: -10063.5885513,
    name: "Bakura"
};






class MapBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {starData: coordinateArray};
    }

    componentDidMount() {

      	// console.log("Grid componentDidMount: ", this);

    	// $.ajax({
    	// 	url: "api/populated-areas",
    	// 	dataType: 'json',
    	// 	cache: true,
    	// 	success: function(data) {

    	// 		// console.log("data: ", data);		
    	// 	  this.setState({populatedCoordinates: data});

    	// }.bind(this),

    	// 	error: function(xhr, status, err) {

    	// 	}.bind(this)
    	// });

        let map;

        $.ajax({
            url: "api/has-location",
            dataType: 'json',
            cache: true,
            success: function(data) {

                this.setState({starData: data});
                buildMap(data);

        }.bind(this),

            error: function(xhr, status, err) {

            }.bind(this)
        });

        // buildMap(coordinateArray);

        function buildMap(starDataCurrent) {

            const galaxyLayer = L.tileLayer(tileServerUrl, {
                minZoom: 2,
                maxZoom: 7,
                crs: L.CRS.Simple,
                tms: true,
                maxBoundsViscosity: 1.0
            });

            // const galaxyLayer = L.tileLayer("/src/tiles-leaflet-new/{z}/{x}/{y}.png", {
            //     minZoom: 2,
            //     maxZoom: 6,
            //     crs: L.CRS.Simple,
            //     tms: true,
            //     maxBoundsViscosity: 1.0
            // });


            map = L.map('map-base', {
                minZoom: 2,
                maxZoom: 7,
                layers: [galaxyLayer]
            }).setView([0, 0], 2);

            window.map = map;

            console.log("map.getBounds: ", map.getBounds());

            map.setMaxBounds(map.getBounds());

            L.circle([Coruscant.yGalactic, Coruscant.xGalactic], {
                radius: 200,
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).bindPopup(Coruscant.system + "<br/>" + "<span>Lat: " +  Coruscant.yGalactic + "</span><br/><span>Lng: " + Coruscant.xGalactic + "</span>").addTo(map);



            const gridLabelsArray = [];

            const gridPane = map.createPane('grid');
            gridPane.style.zIndex = 220;

            const gridBorderLayer = L.geoJSON(GridData, {
                style: function (feature) {
                    return {color: '#49fb35', weight: 0.5, fill: false};
                },
                onEachFeature: function (feature, layer) {

                    let polygonArray = feature.geometry.coordinates[0][0];
                    polygonArray = polygonArray.slice(0, 4);

                    const polygon = L.polygon(convertGeoJsonToMap(polygonArray));
                    const polygonCenter = polygon.getBounds().getCenter();

                    gridLabelsArray.push({
                        grid: feature.properties.grid,
                        point: polygonCenter,
                        feature: feature
                    });

                },
                pane: gridPane
            });

            const gridLabelMarkers = createGridLabelsFromGeoJson(gridLabelsArray);
            const gridLayer = L.featureGroup(gridLabelMarkers, {pane: gridPane});
            gridLayer.addLayer(gridBorderLayer);



            const regionPane = map.createPane('region');
            regionPane.style.zIndex = 250;

            const regionLayer = L.geoJSON(RegionData, {
                style: function (feature) {
                    return {color: 'purple', weight: 2, fill: false};
                },
                onEachFeature: function (feature, layer) {

                    console.log("region: ", feature);

                    // if(feature.properties.region) {

                    //     layer.bindPopup(feature.properties.sector);

                    // }

                },
                pane: regionPane
            });

            regionLayer.bringToBack();


            const sectorPane = map.createPane('sector');
            sectorPane.style.zIndex = 260;

            const sectorLayer = L.geoJSON(SectorData, {
                style: function (feature) {
                    return {color: 'gold', weight: 1, opacity: 0.5};
                },
                onEachFeature: function (feature, layer) {

                    if(feature.properties.sector) {

                        layer.bindPopup(feature.properties.sector);

                    }

                },
                pane: sectorPane
            });

            sectorLayer.bringToBack();


            const hyperspacePane = map.createPane('hyperspace');
            hyperspacePane.style.zIndex = 270;

            const hyperspaceLayer = L.geoJSON(HyperSpaceData, {
                style: function (feature) {
                    return {color: '#00FFFF', weight: 3};
                },
                onEachFeature: function (feature, layer) {

                    if(feature.properties.hyperspace) {

                        layer.bindPopup(feature.properties.hyperspace)
                        .on('mouseover', function (e) {
                            this.openPopup();
                        })
                        .on('mouseout', function (e) {
                            this.closePopup();
                        });

                    } else {

                        layer.bindPopup("Unamed hyperspace route")
                        .on('mouseover', function (e) {
                            this.openPopup();
                        })
                        .on('mouseout', function (e) {
                            this.closePopup();
                        });
                    }

                },
                pane: hyperspacePane
            });



            const starSystemPane = map.createPane('stars');
            starSystemPane.style.zIndex = 410;

            const starSystemLayer = L.featureGroup(createStarMap(starDataCurrent), {pane:starSystemPane});
            starSystemLayer.bringToFront();



            const baseMaps = {
                "Galaxy": galaxyLayer
            };

            const overlayMaps = {
                "Grid": gridLayer,
                "Regions": regionLayer,
                "Sectors": sectorLayer,
                "Hyper Lanes": hyperspaceLayer,
                "Star Systems": starSystemLayer
            };


            L.control.layers(baseMaps, overlayMaps).addTo(map);
            gridLayer.addTo(map);

            const mapBoundaries = map.getBounds();
            console.log("Map Boundaries: ", mapBoundaries);

            const maxZoom = map.getMaxZoom();

        };


        function createStarMap(starData) {

            const starSystemTempArray = [];

            for(let i=0; i < starData.length; i++) {

                starSystemTempArray.push( placeStarOnMap(starData[i]) );

            }

            return starSystemTempArray;

        };


        function placeStarOnMap(StarObject) {

            const StarLatLng = StarObject.LngLat;

            return L.circle([StarLatLng[1], StarLatLng[0]], {
                radius: 200,
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            })
            .bindPopup(StarObject.system + "<br/>" + "<span>x: " +  StarObject.xGalactic + "</span><br/><span>y: " + StarObject.yGalactic + "</span><br /><span>Grid: " + StarObject.coordinates +  "</span>")
            .on('mouseover', function (e) {
                this.openPopup();
            })
            .on('mouseout', function (e) {
                this.closePopup();
            });;

        };

        function createGridLabelsFromGeoJson(labelArrayTemp) {

            const gridLabelsArrayTemp = [];

            for(let currentGridObject of labelArrayTemp) {

                let myIcon = L.divIcon({
                    className: "gridClass",
                    iconSize: new L.Point(30, 20), 
                    html: currentGridObject.grid
                });

                let labelMarker = L.marker([currentGridObject.point.lat, currentGridObject.point.lng], {icon: myIcon});

                gridLabelsArrayTemp.push(labelMarker);

            }

            return gridLabelsArrayTemp;

        };


        function convertGeoJsonToMap(geojsonArray) {

            const latLngArray = [];

            for(let currentCoordinateArray of geojsonArray) {

                latLngArray.push(geoJsonToLatLng(currentCoordinateArray));

            }

            return latLngArray;

        };


        function geoJsonToLatLng(geojsonLngLat) {

            return [ geojsonLngLat[1], geojsonLngLat[0] ];

        };



        function convertPixelToLatLng(xValue, yValue) {

            let MapPoint = map.containerPointToLayerPoint([xValue, yValue]);
            return map.layerPointToLatLng(MapPoint);

        };

        function revertCoordinates(CurrentSystemTemp) {

            let x = parseFloat(CurrentSystemTemp.xGalactic) / 125.0;
            let y = parseFloat(CurrentSystemTemp.yGalactic) / 125.0;
            let xNew = Math.round(x);
            let yNew = Math.round(y);

            return {
                x: xNew,
                y: yNew
            };
        };


        function galacticToMapCoordinate(x, y) {

            const GalacticCenterCoruscant = {
                GalacticCoordinates: {
                    x: 0,
                    y: 0
                },
                MapCoordinates: {
                    x: 500,
                    y: 500
                }
            };

            let mapXValue = ((40/12.0) * x) + GalacticCenterCoruscant.MapCoordinates.x;
            let mapYValue = ((-40/12.0) * y) + GalacticCenterCoruscant.MapCoordinates.y;
            let mapXTextValue = mapXValue - 15;
            let mapYTextValue = mapYValue - 6;

            return {
                x: mapXValue,
                y: mapYValue,
                xText: mapXTextValue,
                yText: mapYTextValue
            }
        };


        function csvToPixel(xValue, yValue) {

            const CurrentSystem = {
                xGalactic: xValue,
                yGalactic: yValue
            };

            const GalacticCoordinatesTemp = revertCoordinates(CurrentSystem);

            console.log("GalacticCoordinatesTemp: ", GalacticCoordinatesTemp);

            return galacticToMapCoordinate(GalacticCoordinatesTemp.x, GalacticCoordinatesTemp.y);

        };


        function galacticToMapLatLng(xGalactic, yGalactic) {

            const pixelCoords = csvToPixel(xGalactic, yGalactic);

            console.log("pixelCoords: ", pixelCoords);

            const LatLng = convertPixelToLatLng(pixelCoords.x, pixelCoords.y);

            console.log("LatLng: ", LatLng);

            return LatLng;

        };

    }

    render() {

  	// console.log("props.grid: ", this.props);

  //   return (
		// <svg id="grid-component" className={gridOverallStyle}  width={this.props.width} height={this.props.height} style={gridStyle}>{generateGridCell(this.props.population, this.state.populatedCoordinates)}
		// </svg>
  //   );

		const height = 1000;
		const width = 1000;

		return (

			<div id="map-base"  style={ {position:"absolute", height: height, width: width} }>
			</div>

		)

	}
}


function requireAll(r) {
	console.log("tile files: ", r.keys());
	r.keys().forEach(r); 
}

function requireAll2(requireContext) {
    return requireContext.keys().map(requireContext);
}

// const mapStateToProps = (state = {}) => {
//     return Object.assign({}, state);
// };


// export default connect(mapStateToProps)(MapBase);

export default MapBase;

// <Map id="map-main" center={position} zoom={2} height={1000} width={1000}>
// 	<TileLayer
// 	  url='./map-tiles/{z}/{x}/{y}.png'
// 	/>
// </Map>