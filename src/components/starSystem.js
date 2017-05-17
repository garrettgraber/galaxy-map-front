import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import StarSystemPopup from './starSystemPopup';


class StarSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };

    }

    componentDidMount() {

        // console.log("StarSystem has mounted: ", this);

        if(this.refs.star) {

            const star = this.refs.star.leafletElement;

            star.bindPopup(this.props.StarObject.system + "<br/>" + "<span>x: " +  this.props.StarObject.xGalactic + "</span><br/><span>y: " + this.props.StarObject.yGalactic + "</span><br /><span>Grid: " + this.props.StarObject.coordinates +  "</span>");
            
        }


        // star.bindPopup(<StarSystemPopup StarObject={this.props.StarObject}/>);
        // .on('mouseover', function (e) {
        //     star.openPopup();
        // })
        // .on('mouseout', function (e) {
        //     star.closePopup();
        // });


    }

    componentWillReceiveProps(newProps) {

        // console.log("Props update Star System: ", newProps);

    }

    onMouseOver(e) {

        // console.log("mouseOver has fired: ", this);
        // this.setState({open: true});
        // console.log("e: ", e);

        if(this.refs.star) {

            const star = this.refs.star.leafletElement;
            star.openPopup();

        }


        // this.openPopup();

    }

    onMouseOut(e) {


        if(this.refs.star) {

            const star = this.refs.star.leafletElement;
            star.closePopup();


        }
 
        // console.log("mouseOut has fired: ", this);
        // this.setState({open: false});
        // console.log("e: ", e);

        // this.closePopup();
    }

    render() {

        let circleMarker = null;
        // let marker = null;

        const StarStyle = {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        };

        const starColor = 'red';
        const fillColor = '#f03';
        const fileOpacity = 0.5;


        if(this.props.StarObject.zoom + 2 <= this.props.zoom) {

            circleMarker = (<CircleMarker center={[this.props.StarObject.LngLat[1], this.props.StarObject.LngLat[0]]} radius={1} color={starColor} fillColor={fillColor} fileOpacity={fileOpacity} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='star' />)

        }


    	return (
         
    		circleMarker
            
    	)

    }

}


// { this.props.StarObject.zoom <= this.props.zoom ? : null }

// <Tooltip direction={'top'} permanent={true} opacity={0.0}></Tooltip> 

// { this.props.StarObject.zoom > 1 ? <Tooltip>{this.props.StarObject.system}</Tooltip> : null }


export default StarSystem;