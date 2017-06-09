import React from 'react';
import { connect } from 'react-redux';
import { Marker, Pane, GeoJSON, FeatureGroup, LayerGroup, Rectangle } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import '../css/main.css';


// color: "#FF69B4"



class GridCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            cellStyle: "#FF69B4",
            cellLabelClass: "gridClass",
            weight: 0.5
        };


    }

    componentDidMount() {


    }

    onMouseOver(e) {

        // console.log("mouse over label in GridCell: ", this.props.grid);
        // this.setState(cellStyle.color = "red");

        this.setState({cellStyle : "#ffa500"});
        this.setState({cellLabelClass: "gridClassHover"});

        this.setState({weight: 2.5});

        // this.setState({
        //     color : {
        //         color: "red"
        //     }
        // });



    }


    onMouseOut(e) {

        // console.log("mouse has left the label in GridCell: ", this.props.grid);

        // this.setState({cellColor: "#FF69B4"});
    

        this.setState({cellStyle : "#FF69B4"});
        this.setState({cellLabelClass: "gridClass"});

        this.setState({weight: 0.5});


        // this.setState({
        //     color : {
        //         color: "green"
        //     }
        // });

    }

    onMouseOverRectangle(e) {

        // console.log("mouse over in GridCell: ", this.props.grid);

        // this.setState({cellColor: "#ffa500"});


        this.setState({cellStyle : "#ffa500"});
        this.setState({cellLabelClass: "gridClassHover"});
        this.setState({weight: 2.5});


        // this.setState({
        //     color : {
        //         color: "red"
        //     }
        // });

    }


    onMouseOutRectangle(e) {

        // console.log("mouse out of GridCell: ", this.props.grid);
        // this.setState({color: "#FF69B4"});

        this.setState({cellStyle : "#FF69B4"});
        this.setState({cellLabelClass: "gridClass"});

        this.setState({weight: 0.5});


        // this.setState({
        //     color : {
        //         color: "green"
        //     }
        // });

    }



    gridClick(e) {

        console.log("Current cell: ", this.props);

    }

    render() {

        // console.log("this.state.cellStyle: ", this.state.cellStyle);

        const myIcon = L.divIcon({
            className: this.state.cellLabelClass,
            iconSize: new L.Point(30, 20), 
            html: this.props.grid
        });

        const gridLabelPosition = [this.props.lat, this.props.lng];

    	return (

            <Rectangle bounds={this.props.bounds} weight={this.state.weight}  color={this.state.cellStyle} fill={false} onMouseOver={(e) => this.onMouseOverRectangle(e)}  onMouseOut={(e) => this.onMouseOutRectangle(e)} >

                <Marker color={this.state.cellStyle}   key={this.props.grid} position={gridLabelPosition} icon={myIcon} onClick={(e) => this.gridClick(e)} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref="cell"/>


            </Rectangle>

    	)
    
    }

}











const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default GridCell;

export default connect(mapStateToProps)(GridCell);

