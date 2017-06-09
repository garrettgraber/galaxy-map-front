import React from 'react';
import { connect } from 'react-redux';
import { Marker, Pane, GeoJSON, FeatureGroup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import GridLabels from './gridLabels.js';

import GridData from 'json-loader!../data/grid.geojson';

// console.log("GridData: ", GridData);


class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	gridLabelsArray: [],
            gridLabelsReady: false
        };
    }

    componentDidMount() {

    	// console.log("grid ref: ", this.refs.grid.leafletElement);

        // console.log("componentDidMount in grid");
        // console.log("componentDidMount this.props: ", this.props);

    }

    pointToLayer(feature, latlng) {

        // console.log("feature in pointToLayer: ", feature);
        // console.log("latlng in pointToLayer: ", latlng);

    }

    onEachFeature(feature, layer) {

        // console.log("layer: ", layer);

    	// console.log("feature: ", feature);

    	let currentGridValue = feature.properties.grid;

    	let polygonArray = feature.geometry.coordinates[0][0];
        polygonArray = polygonArray.slice(0, 4);

        // console.log("polygonArray: ", polygonArray);

        let polygon = L.polygon(convertGeoJsonToMap(polygonArray));
        let polygonCenter = polygon.getBounds().getCenter();

        let gridInArray = this.state.gridLabelsArray.filter(e => e.grid == currentGridValue);

        // console.log("\ngridInArray: ", gridInArray.length);


        // console.log("polygon: ", polygon);


        // polygon.on('mouseover', e => {
        //     console.log("e: ", e);
        //     console.log("mouseover: ", currentGridValue);
        //     console.log("polygon: ", polygon);
        // });

        // polygon.on('mouseout', e => {
        //     console.log("e: ", e);
        //     console.log("mouseout: ", currentGridValue);
        //     console.log("polygon: ", polygon);

        // });

        const northWestGeoJson = polygonArray[0];
        const southEastGeoJson = polygonArray[2];

        // console.log("northWestGeoJson: ", northWestGeoJson);
        // console.log("southEastGeoJson: ", southEastGeoJson);

        const northWest = geoJsonToLatLng(polygonArray[0]);
        const southEast = geoJsonToLatLng(polygonArray[2]);

        const gridCellBounds = [northWest,  southEast];

        if (gridInArray.length == 0) {

			this.state.gridLabelsArray.push({
	            grid: feature.properties.grid,
	            point: polygonCenter,
                bounds: gridCellBounds
	        });

            // this.state.gridLabelsArray.push( gridLabel({
            //     grid: feature.properties.grid,
            //     point: polygonCenter
            // }) );

            // console.log("this.state.gridLabelsArray: ", this.state.gridLabelsArray.length);

		}

        if(this.state.gridLabelsArray.length >= 552) {

            console.log("\n\nGrid Labels Ready. Release the Krakken! ");

            this.setState({gridLabelsReady: true});
        }


        


    }

    render() {

    	const zIndex = 220;

    	const gridStyle = {color: '#49fb35', weight: 0.5, fill: false};

        const gridStylePink = {color: '#FF69B4', weight: 0.5, fill: false};

        // console.log("\nRender has fired in Grid!");


    	return (


            <LayerGroup className="layer-group">

                <Pane className="pane-test" name="grid-pane" style={{ zIndex: zIndex }  }>

        			<GeoJSON data={GridData} style={gridStylePink} ref='geojson' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature,latlng)}/>

                    { this.state.gridLabelsReady && <GridLabels gridLabelsArray={this.state.gridLabelsArray} /> }
               
                </Pane>

            </LayerGroup>

    	)

    }

}



// <FeatureGroup className="labels-test">
//     { this.state.gridLabelsArray }
// </FeatureGroup>


/*
<FeatureGroup>
    {(gridInArray.length >= 552)? }
</FeatureGroup>
*/

// <FeatureGroup>
// 	{renderGridLabels(this.state.gridLabelsArray)}
// </FeatureGroup>

/*
<FeatureGroup>
    {(this.state.gridLabelsArray.length === 552)? renderGridLabels(this.state.gridLabelsArray) : ''}
</FeatureGroup>
*/


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


// function gridLabel(currentGridObject) {

//    let myIcon = L.divIcon({
//         className: "gridClass",
//         iconSize: new L.Point(30, 20), 
//         html: currentGridObject.grid
//     });

//     const gridLabelPosition = [currentGridObject.point.lat, currentGridObject.point.lng];

//     return <Marker key={currentGridObject.grid} position={gridLabelPosition} icon={myIcon} />;

// }

// function renderGridLabels(labelArrayTemp) {

//     console.log("renderGridLabels has fired");

//     const gridLabelsArrayTemp = [];

//     for(let currentGridObject of labelArrayTemp) {

//         let myIcon = L.divIcon({
//             className: "gridClass",
//             iconSize: new L.Point(30, 20), 
//             html: currentGridObject.grid
//         });

//         // let labelMarker = L.marker([currentGridObject.point.lat, currentGridObject.point.lng], {icon: myIcon});

//         const gridLabelPosition = [currentGridObject.point.lat, currentGridObject.point.lng];

//         gridLabelsArrayTemp.push( <Marker key={currentGridObject.grid} position={gridLabelPosition} icon={myIcon} /> ) ;

//     }

//     return gridLabelsArrayTemp;

// };

// function createGridLabelsFromGeoJson(labelArrayTemp) {

//     const gridLabelsArrayTemp = [];

//     for(let currentGridObject of labelArrayTemp) {

//         let myIcon = L.divIcon({
//             className: "gridClass",
//             iconSize: new L.Point(30, 20), 
//             html: currentGridObject.grid
//         });

//         let labelMarker = L.marker([currentGridObject.point.lat, currentGridObject.point.lng], {icon: myIcon});

//         gridLabelsArrayTemp.push(labelMarker);

//     }

//     return gridLabelsArrayTemp;

// };

export default Grid;
