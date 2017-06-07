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

    	return (

           <FeatureGroup className="labels-test">
                { this.state.gridLabelsArray }
            </FeatureGroup>

    	)
    
    }

}



function renderGridLabels(labelArrayTemp) {

    // console.log("renderGridLabels has fired!");

    const gridLabelsArrayTemp = [];

    for(let currentGridObject of labelArrayTemp) {

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

        gridLabelsArrayTemp.push( <GridCell key={gridName} grid={gridName} lat={lat} lng={lng} /> ) ;


    }

    return gridLabelsArrayTemp;

};


export default GridLabels;