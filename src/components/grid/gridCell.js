import React from 'react';
import { connect } from 'react-redux';
import { Marker, Rectangle } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

import '../../css/main.css';

import {
    zoomToLocation
} from '../../actions/actions.js';


class GridCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      cellStyle: "#FF69B4",
      cellLabelClass: "gridClass",
      weight: 0.5
    };
  }

  componentDidMount() { }

  onMouseOver(e) {
    this.setState({cellStyle : "#ffa500"});
    this.setState({cellLabelClass: "gridClassHover"});
    this.setState({weight: 2.5});
  }


  onMouseOut(e) {
    this.setState({cellStyle : "#FF69B4"});
    this.setState({cellLabelClass: "gridClass"});
    this.setState({weight: 0.5});
  }

  onMouseOverRectangle(e) {
    this.setState({cellStyle : "#ffa500"});
    this.setState({cellLabelClass: "gridClassHover"});
    this.setState({weight: 2.5});
  }

  onMouseOutRectangle(e) {
    this.setState({cellStyle : "#FF69B4"});
    this.setState({cellLabelClass: "gridClass"});
    this.setState({weight: 0.5});
  }

  gridClick(e) {
    this.props.dispatch(zoomToLocation([this.props.lat, this.props.lng], 6));
  }

  render() {
    const myIcon = L.divIcon({
      className: this.state.cellLabelClass,
      iconSize: new L.Point(30, 20), 
      html: this.props.grid
    });
    const gridLabelPosition = [this.props.lat, this.props.lng];

  	return (
      <Rectangle bounds={this.props.bounds} weight={this.state.weight}  color={this.state.cellStyle} fill={false} onMouseOver={(e) => this.onMouseOverRectangle(e)}  onMouseOut={(e) => this.onMouseOutRectangle(e)} ref="cell">
        <Marker color={this.state.cellStyle}   key={this.props.grid} position={gridLabelPosition} icon={myIcon} onClick={(e) => this.gridClick(e)} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} ref="cellLabel"/>
      </Rectangle>
  	)
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};


export default connect(mapStateToProps)(GridCell);