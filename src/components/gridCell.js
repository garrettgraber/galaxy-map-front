import React from 'react';
import { connect } from 'react-redux';
import { Marker, Pane, GeoJSON, FeatureGroup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
// import ReactFauxDOM from 'react-faux-dom';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';



class GridCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cellStyle: "gridClass"
        };

    }

    componentDidMount() {


    }

    onMouseOver(e) {

        this.setState({cellStyle: "gridClassHover"});

    }

    onMouseOut(e) {

        this.setState({cellStyle: "gridClass"});

    }

    gridClick(e) {

        console.log("Current cell: ", this.props.grid);

    }

    render() {

        const myIcon = L.divIcon({
            className: this.state.cellStyle,
            iconSize: new L.Point(30, 20), 
            html: this.props.grid
        });

        const gridLabelPosition = [this.props.lat, this.props.lng];

    	return (

           <Marker key={this.props.grid} position={gridLabelPosition} icon={myIcon} onClick={(e) => this.gridClick(e)} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref="cell"/>

    	)
    
    }

}






const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default GridCell;

export default connect(mapStateToProps)(GridCell);

