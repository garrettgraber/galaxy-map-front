import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';

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

        if(this.refs.star && this.refs.starText) {

            const star = this.refs.star.leafletElement;

            const StarObject = this.props.StarObject;
            const starPoints = this.props.map.latLngToLayerPoint(StarObject.latLng);

            star.bindPopup(StarObject.system + "<br/>" + "<span>x: " + StarObject.xGalactic.toString() + "</span><br/><span>y: " + StarObject.yGalactic.toString() + "</span><br /><span>Grid: " + StarObject.coordinates +  "</span><br/><span>lat:" + StarObject.latLng.lat + "</span><br/><span>lng: " + StarObject.latLng.lng + "</span></br><span>xp:" + starPoints.x + "</span><br/><span>yp:" + starPoints.y + "</span></br><span>Sector:" + StarObject.sector[0] + "</span>");

        }


    }

    componentWillReceiveProps(newProps) {

        // console.log("Props update Star System: ", newProps);

    }

    onMouseOver(e) {

        if(this.refs.star && this.refs.starText) {

            const star = this.refs.star.leafletElement;
            star.openPopup();

        }

    }

    onMouseOut(e) {

        if(this.refs.star && this.refs.starText) {

            const star = this.refs.star.leafletElement;
            star.closePopup();

        }

    }

    render() {


        const StarStyle = {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        };

        const starColor = 'red';
        const fillColor = '#f03';
        const fileOpacity = 0.5;

        const TooltipStyle = {
            backgroundColor: 'black',
            color: 'white'
        };


        const textWidth = this.props.StarObject.textWidth;

        let myIcon = L.divIcon({
            className: "systemLabel",
            iconSize: new L.Point(this.props.StarObject.textWidth + 30, 24),
            iconAnchor: new L.Point(textWidth / 3.0, 18),
            html: this.props.StarObject.system
        });

    	return (

            <div>
                <CircleMarker center={this.props.StarObject.latLng} radius={1} color={starColor} fillColor={fillColor} fileOpacity={fileOpacity} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='star' />
                <Marker key={this.props.StarObject.system} position={this.props.StarObject.latLng} icon={myIcon} zIndexOffset={-5} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='starText'/>
            </div>
                                            
    	)

    }

}


export default StarSystem;