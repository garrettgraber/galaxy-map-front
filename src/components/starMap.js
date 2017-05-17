import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import StarSystem from './starSystem.js';



class StarMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	starData: [],
        	starDataLoaded: false
        };

    }

    componentDidMount() {

    	console.log("StarMap has mounted: ", this.props);

    	const that = this;

    	fetch('/api/has-location')  
			.then(function(response) {
		    	return response.json();
			}).then(function(data) {

	    		console.log("Star Data: ", data);

	    		that.setState({starData: data}); 

	    		that.setState({starDataLoaded: true});

	    	});

    }


    componentWillReceiveProps(newProps) {

    	console.log("Props update StarMap: ", newProps);

    }

    render() {

    	const zIndex = 290;


    	return (

    		<Pane name="star-pane" style={{zIndex: zIndex}}>

				<FeatureGroup>

					{ this.state.starDataLoaded === true && createStarMap(this.state.starData, this.props.zoom) }

				</FeatureGroup>
	    		

    		</Pane>

    	)

    }

}



function createStarMap(starData, currentZoom) {

    const starSystemTempArray = [];

    for(let i=0; i < starData.length; i++) {

        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} /> );

    }

    return starSystemTempArray;

};


// function placeStarOnMap(StarObject) {

//     const StarLatLng = StarObject.LngLat;

//     return L.circle([StarLatLng[1], StarLatLng[0]], {
//         radius: 200,
//         color: 'red',
//         fillColor: '#f03',
//         fillOpacity: 0.5
//     })
//     .bindPopup(StarObject.system + "<br/>" + "<span>x: " +  StarObject.xGalactic + "</span><br/><span>y: " + StarObject.yGalactic + "</span><br /><span>Grid: " + StarObject.coordinates +  "</span>")
//     .on('mouseover', function (e) {
//         this.openPopup();
//     })
//     .on('mouseout', function (e) {
//         this.closePopup();
//     });;

// };




export default StarMap;