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


class RegionLabels extends React.Component {
    constructor(props) {
        super(props);

       this.state = {
            regionsComponentsReady: false,
            regionsLabelComponents: []
        }
    }

    componentDidMount() {
        const regionsLabelComponents = renderRegionLabels(this.props.regionsLabelsArray);
        this.setState({regionsLabelComponents : regionsLabelComponents});
        this.setState({regionsComponentsReady : true});
    }

    renderRegionLabelsByline(labelArrayTemp) {
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
            const labelPosition = [currentObject.lat, currentObject.lng];
            labelsArrayTemp.push(<Marker key={currentObject.region} position={labelPosition} icon={myIcon}/>);
            labelsArrayTemp.push( <GridCell key={gridName} grid={gridName} lat={lat} lng={lng} /> ) ;
        }

        this.setState({regionsLabelComponents : labelsArrayTemp});
        this.setState({regionsComponentsReady : true});
    }


    render() {
    	return (
           <FeatureGroup className="regions-test">
                { renderComponentsOrNull(this.state.regionsLabelComponents) }
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


function renderRegionLabels(labelArrayTemp) {
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
        const labelPosition = [currentObject.lat, currentObject.lng];
        labelsArrayTemp.push(<Marker key={currentObject.region} position={labelPosition} icon={myIcon}/>);
    }
    return labelsArrayTemp;
};


export default RegionLabels;