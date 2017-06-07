import React from 'react';
import { connect } from 'react-redux';
import { Marker, Pane, GeoJSON, FeatureGroup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';

// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';



// import GridCell from './gridCell.js';


class RegionLabels extends React.Component {
    constructor(props) {
        super(props);

       this.state = {
            regionsComponentsReady: false,
            regionsLabelComponents: []
        }
    }

    componentDidMount() {

    	// console.log("grid ref: ", this.refs.grid.leafletElement);

        // console.log("componentDidMount in RegionLabels");
        // console.log("regionsLabelsArray: ", this.props.regionsLabelsArray);
        const regionsLabelComponents = renderRegionLabels(this.props.regionsLabelsArray);
        // console.log("regionsLabelComponents: ", regionsLabelComponents);
        this.setState({regionsLabelComponents : regionsLabelComponents});
        this.setState({regionsComponentsReady : true});
        // console.log("state: ", this.state);

    }




    renderRegionLabelsByline(labelArrayTemp) {

        // console.log("renderRegionLabels has fired!");

        const labelsArrayTemp = [];

        for(let currentObject of labelArrayTemp) {

            let currentRegion = currentObject.region;
            currentRegion = currentRegion.toUpperCase();

            const textWidth = width(currentRegion, {
                size: "2em"
            });

            let myIcon = L.divIcon({
                className: "regionClass",
                iconSize: new L.Point(textWidth, 20),
                iconAnchor: new L.Point(textWidth / 2.0, 14),
                html: currentRegion
            });

            // let labelMarker = L.marker([currentObject.lat, currentObject.lng], {icon: myIcon});

            const labelPosition = [currentObject.lat, currentObject.lng];

            labelsArrayTemp.push(<Marker key={currentObject.region} position={labelPosition} icon={myIcon}/>);

            // const gridName = currentGridObject.grid;
            // const lat = currentGridObject.point.lat;
            // const lng = currentGridObject.point.lng;

            labelsArrayTemp.push( <GridCell key={gridName} grid={gridName} lat={lat} lng={lng} /> ) ;


        }

        this.setState({regionsLabelComponents : labelsArrayTemp});
        this.setState({regionsComponentsReady : true});

        // return labelsArrayTemp;

    }


    render() {

        console.log("state: ", this.state);

    	return (

           <FeatureGroup className="regions-test">

                { this.state.regionsLabelComponents }
            </FeatureGroup>

    	)
    
    }

}



// { renderRegionLabels(this.props.regionsLabelsArray) }


function renderRegionLabels(labelArrayTemp) {

    // console.log("renderRegionLabels has fired!");

    const labelsArrayTemp = [];

    for(let currentObject of labelArrayTemp) {

        let currentRegion = currentObject.region;
        currentRegion = currentRegion.toUpperCase();

        const textWidth = width(currentRegion, {
            size: "2em"
        });

        let myIcon = L.divIcon({
            className: "regionClass",
            iconSize: new L.Point(textWidth, 20),
            iconAnchor: new L.Point(textWidth / 2.0, 14),
            html: currentRegion
        });

        // let labelMarker = L.marker([currentObject.lat, currentObject.lng], {icon: myIcon});

        const labelPosition = [currentObject.lat, currentObject.lng];

        labelsArrayTemp.push(<Marker key={currentObject.region} position={labelPosition} icon={myIcon}/>);

        // const gridName = currentGridObject.grid;
        // const lat = currentGridObject.point.lat;
        // const lng = currentGridObject.point.lng;

        // labelsArrayTemp.push( <GridCell key={gridName} grid={gridName} lat={lat} lng={lng} /> ) ;


    }

    // this.setState({regionsLabelComponents : labelsArrayTemp});
    // this.setState({regionsComponentsReady : true});

    return labelsArrayTemp;

};


export default RegionLabels;