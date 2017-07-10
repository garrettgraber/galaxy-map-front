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
        const starLocation = [ this.props.StarObject.lat, this.props.StarObject.lng ];



        let myIcon = L.divIcon({
            className: "systemLabel",
            iconSize: new L.Point(this.props.StarObject.textWidth + 30, 24),
            iconAnchor: new L.Point(textWidth / 3.0, 18),
            // iconAnchor: new L.Point(0, 0),
            html: this.props.StarObject.system
        });

    	return (

            <div>
                <CircleMarker center={starLocation} radius={1} color={starColor} fillColor={fillColor} fileOpacity={fileOpacity} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='star' />
                <Marker key={this.props.StarObject.system} position={starLocation} icon={myIcon} zIndexOffset={-5} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref='starText'/>
            </div>
                                            
    	)

    }

}


export default StarSystem;



function StarMap(argument) {



    

        if(false) {





            for(let i=0; i < this.state.starData.length; i++) {


                let currentStarData = this.state.starData[i];



                // let currentStarData = starsCurrentlyInView[i];

                // console.log("currentStarData: ", currentStarData);
                // console.log("Current i: ", i);

                if(!currentStarData.hasOwnProperty('latLng')) {

                    if(currentStarData.lat === null && currentStarData.lng === null) {

                        // console.log("currentStar data has lat: ", currentStarData.lat);

                        const starLngLat = currentStarData.LngLat;

                        const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
                        // console.log("currentLatLng: ", currentLatLng);
                        this.state.starData['lat'] = currentLatLng[1];
                        this.state.starData['lng'] = currentLatLng[0];

                        this.state.starData[i].latLng = currentLatLng;

                    } else {

                        const currentLatLng = L.latLng(currentStarData.lat, currentStarData.lng);
                        // console.log("currentLatLng: ", currentLatLng);
                        this.state.starData[i].latLng = currentLatLng;


                    }

                }




                let objectInView = currentStarData.starInMapView(this.props.map, mapWidth, mapHeight, MapBoundaries);

                if(zoomLevelBasedRendering && objectInView) {


                    if(currentStarData.zoom === 0) {

                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true} /> );


                        starSystemArray.push(currentStarData);

                    }



                    if(currentStarData.zoom === 1 && currentZoom >= 3) {


                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );

                        starSystemArray.push(currentStarData);

                    }

                    // console.log("Star Found! ", starData[i]);

                   // const objectInvView = ObjectInMapView(starData[i], map);

                   //  if(objectInvView) {

                        // console.log("objectInView: ", objectInView);



                   //  }
                


                    // if(currentStarData.zoom === 0) {

                    //     starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true} /> );

                    // }



                    // if(currentStarData.zoom === 1 && currentZoom >= 3) {


                    //     starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );


                    // }

                    if(currentStarData.zoom === 2 && currentZoom >= 5) {

                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true} /> );

                        starSystemArray.push(currentStarData);


                    }

                    if(currentStarData.zoom === 3 && currentZoom >= 6) {

                        starSystemTempArray.push( <StarSystem key={this.state.starData[i].system} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );

                        starSystemArray.push(currentStarData);

                    }


                } else if (!zoomLevelBasedRendering && objectInView)  {

                    starSystemTempArray.push( <StarSystem key={this.state.starData[i].system + "|x:" + this.state.starData[i].xGalactic +  "|y:" + this.state.starData[i].yGalactic} StarObject={this.state.starData[i]} zoom={currentZoom} map={this.props.map} labels={true}  /> );

                        starSystemArray.push(currentStarData);

                }



            }

        }

    // body...
}