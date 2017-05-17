import React from 'react';
import { connect } from 'react-redux';
import { Popup } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';



class StarSystemPopup extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

        console.log("StarSystem Popup has mounted");


    }

    render() {

    	console.log("Star System Popup has rendered");

    	return (

    		<Popup>
	    		<div className="star-system-popup">
					<span style={{fontWeight: 'bold'}}>{this.props.StarObject.system}</span><br/>
					<span>x:&nbsp;&nbsp;{this.props.StarObject.xGalactic}</span><br/>
					<span>y:&nbsp;&nbsp;{this.props.StarObject.yGalactic}</span><br/>
					<span>Grid:&nbsp;&nbsp;{this.props.StarObject.coordinates}</span>
	    		</div>
            </Popup>


    	)

    }

}


export default StarSystemPopup;