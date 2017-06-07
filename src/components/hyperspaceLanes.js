import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


import HyperspaceData from 'json-loader!../data/hyperspace.geojson';

console.log("HyperspaceData: ", HyperspaceData);



class HyperspaceLanes extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

                console.log("Hyperspace data has been found!: ", this.props);

    }

    onEachFeature(feature, layer) {

        if(feature.properties.hyperspace) {

            layer.bindPopup(feature.properties.hyperspace)
            .on('click', function (e) {
                this.openPopup();
            })
            // .on('mouseout', function (e) {
            //     this.closePopup();
            // });

        } else {

            layer.bindPopup("Unamed Hyperspace Lane")
            .on('click', function (e) {
                this.openPopup();
            })
            // .on('mouseout', function (e) {
            //     this.closePopup();
            // })s;
        }
	
    }

    pointToLayer(feature, latlng) {




    }

    render() {


    	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};


        const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};

        const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};



    	const zIndex = 270;




    	return (

    		<Pane name="hyperspace-pane" style={{ zIndex: zIndex }}>

    			<GeoJSON data={HyperspaceData} style={hyperspaceLanesStyleCarolina} ref='hyperspace' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature, latlng)}/>
    		</Pane>

    	)

    }

}

// export default HyperspaceLanes;




const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default MapMain;

export default connect(mapStateToProps)(HyperspaceLanes);

