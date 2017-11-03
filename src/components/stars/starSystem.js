import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
// import ReactFauxDOM from 'react-faux-dom';
import { 
  hyperspacePositionSearch
} from '../../actions/actions.js';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';
import StarSystemPopup from './starSystemPopup';


class StarSystem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true
      };
    }

    componentDidMount() {
      console.log("StarSystem has mounted: ", this.props);
      if(this.refs.star && this.refs.starText) {
        const star = this.refs.star.leafletElement;
        const StarObject = this.props.StarObject;
        const StarPoints = this.props.StarPoints;
        star.bindPopup(StarObject.system + "<br/>" + "<span>x: " + StarObject.xGalactic.toString() + "</span><br/><span>y: " + StarObject.yGalactic.toString() + "</span><br /><span>Grid: " + StarObject.coordinates +  "</span><br/><span>lat:" + StarObject.latLng.lat + "</span><br/><span>lng: " + StarObject.latLng.lng + "</span></br><span>xp:" + StarPoints.x + "</span><br/><span>yp:" + StarPoints.y + "</span></br><span>Sector:" + StarObject.sector[0] + "</span>");
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

    onClick(e) {
      console.log("star click");

      if(this.props.pathStartClick || this.props.pathEndClick) {
        const isStartPosition = (this.props.pathStartClick && !this.props.pathEndClick)? true : false;
        const Search = {system: this.props.StarObject.system, isStartPosition: isStartPosition};
        this.props.dispatch(hyperspacePositionSearch(Search));
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
          <CircleMarker center={starLocation} radius={1} color={starColor} fillColor={fillColor} fileOpacity={fileOpacity} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} onClick={(e) => this.onClick(e)}  ref='star' />
          <Marker key={this.props.StarObject.system} position={starLocation} icon={myIcon} zIndexOffset={-5} onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)} onClick={(e) => this.onClick(e)} ref='starText'/>
        </div>                                            
    	)
    }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(StarSystem);

// export default StarSystem;