import React from 'react';
import { connect } from 'react-redux';
import { Marker, Pane, GeoJSON, FeatureGroup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


import GridCell from './gridCell.js';


class GridLabels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gridLabelsArray: [],
            gridLabelsReady: false
        };

    }

    componentDidMount() {

    	// console.log("grid ref: ", this.refs.grid.leafletElement);

        // console.log("componentDidMount in GridLables");
        const gridLabelsArray = renderGridLabels(this.props.gridLabelsArray);
        // console.log("gridLabelsArray: ", gridLabelsArray);
        this.setState({gridLabelsArray : gridLabelsArray});
        this.setState({gridLabelsReady: true});

        // console.log("renderGridLabelsComponents: ", this.renderGridLabelsComponents());


    }


    renderGridLabelsComponents(){
        if (this.state.gridLabelsReady) {
            return (
                this.state.gridLabelsArray
              );
        } else {
            const gridLabelsArray = renderGridLabels(this.props.gridLabelsArray);
            // console.log("gridLabelsArray: ", gridLabelsArray);
            this.setState({gridLabelsArray : gridLabelsArray});
            this.setState({gridLabelsReady: true});
            return gridLabelsArray;
        }
    }


    render() {

        console.log("render grid labels: ", this.state.gridLabelsArray);

    	return (

           <FeatureGroup className="labels-test">
                { renderComponentsOrNull(this.state.gridLabelsArray) }
            </FeatureGroup>

    	)
    
    }

}




function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}




function renderGridLabels(labelArrayTemp) {

    // console.log("renderGridLabels has fired!");

    const gridLabelsArrayTemp = [];

    for(let currentGridObject of labelArrayTemp) {


        // console.log("currentGridObject: ", currentGridObject);

        // let myIcon = L.divIcon({
        //     className: "gridClass",
        //     iconSize: new L.Point(30, 20), 
        //     html: currentGridObject.grid
        // });

        // let labelMarker = L.marker([currentGridObject.point.lat, currentGridObject.point.lng], {icon: myIcon});

        // const gridLabelPosition = [currentGridObject.point.lat, currentGridObject.point.lng];

        // gridLabelsArrayTemp.push( <Marker key={currentGridObject.grid} position={gridLabelPosition} icon={myIcon} /> ) ;

        const gridName = currentGridObject.grid;
        const lat = currentGridObject.point.lat;
        const lng = currentGridObject.point.lng;

        gridLabelsArrayTemp.push( <GridCell key={gridName} grid={gridName} lat={lat} lng={lng} bounds={currentGridObject.bounds}  /> ) ;


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




export default GridLabels;