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



class StarMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	starData: [],
        	starDataLoaded: false
        };

    }

    componentDidMount() {

    	// console.log("StarMap has mounted: ", this.props);
    	// console.log("StarMap this.refs: ", this.refs);

    	const that = this;

    	fetch('/api/has-location')  
			.then(function(response) {
		    	return response.json();
			}).then(function(data) {

	    		console.log("Star Data: ", data);

	    		for(let i=0; i < data.length; i++) {

					const textWidth = width(data[i].system, {
			            size: "1em"
			        });

                    const currentStar = data[i];
                    console.log("currentStar: ", currentStar);
			        currentStar.textWidth = textWidth + 0.5;

	    		}

	    		that.setState({starData: data}); 

	    		that.setState({starDataLoaded: true});

	    	});

    }


    componentWillReceiveProps(newProps) {

    	// console.log("Props update StarMap: ", newProps);

    }

    render() {

    	const zIndex = 290;


    	return (

    		<Pane name="star-pane" style={{zIndex: zIndex}}>

				<FeatureGroup>

					{ this.state.starDataLoaded === true && createStarMap(this.state.starData, this.props.zoom, this.props.map) }

				</FeatureGroup>
	    		

    		</Pane>

    	)

    }

}



function createStarMap(starData, currentZoom, map) {

    const starSystemTempArray = [];

    const zoomLevelBasedRendering = true;

    for(let i=0; i < starData.length; i++) {

    	const currentStarData = starData[i];

    	if(!currentStarData.hasOwnProperty('latLng')) {

			const starLngLat = currentStarData.LngLat;

	    	const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);

	    	starData[i].latLng = currentLatLng;

    	}

        if(zoomLevelBasedRendering) {

        	if(currentStarData.zoom === 0) {

    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true} /> );

        	}

        	if(currentStarData.zoom === 1 && currentZoom >= 4) {


    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );


        	}

        	if(currentStarData.zoom === 2 && currentZoom >= 5) {

    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true} /> );


        	}

        	if(currentStarData.zoom === 3 && currentZoom >= 6) {

    	        starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );

        	}


        } else {

            starSystemTempArray.push( <StarSystem key={starData[i].system} StarObject={starData[i]} zoom={currentZoom} map={map} labels={true}  /> );

        }


    }

    return starSystemTempArray;

};



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

