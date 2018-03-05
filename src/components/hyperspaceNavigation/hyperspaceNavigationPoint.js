import React from 'react';
import { connect } from 'react-redux';
import { CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import { If, Then, Else } from 'react-if';
import L from 'leaflet';
import width from 'text-width';
import uuidv4 from 'uuid/v4';

import ApiService from '../../remoteServices/apiService.js';


import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';


class HyperspaceNavigationPoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: null,
      starMapState: true,
      link: ''
    };
  }
  componentDidMount() {
    this.setState({zoom: this.props.mapCenterAndZoom.zoom});
    this.setState({starMapState: this.props.starMapOverlayStatus});


    if(!this.props.HyperSpacePoint.emptySpace) {
      ApiService.systemLink({system: this.props.HyperSpacePoint.system}).then(response => {
        return response.json();
      }).then(data => {
       // console.log("data: ", isJson(data));

        const DataParsed = JSON.parse(data);
        console.log("Data: ", DataParsed.link);
        this.setState({link: DataParsed.link});
      });
    }

    // if(this.refs.nodeHyperSpace && this.refs.nodeText) {
    //   const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
    //   const HyperSpaceNodeObject = this.props.HyperSpaceNodeObject;
    //   nodeHyperSpace.bindPopup(HyperSpaceNodeObject.system + "</span><br/><span>Node Id: " + HyperSpaceNodeObject.nodeId + "<br/>" + "<span>lat:" + HyperSpaceNodeObject.lat + "</span><br/><span>lng: " + HyperSpaceNodeObject.lng + "</span></br><span>Hyperspace Lanes:" + HyperSpaceNodeObject.hyperspaceLanes.join(", ") + "</span>");
    // }
  }
  componentWillReceiveProps(newProps) {
    // console.log("Props update Star System: ", newProps);

    console.log("newProps.mapCenterAndZoom.zoom", newProps.mapCenterAndZoom.zoom);


    this.setState({starMapState: newProps.starMapOverlayStatus});

    if(newProps.mapCenterAndZoom.zoom !== this.state.zoom) {
      console.log("Zoom change!");
      this.setState({zoom: newProps.mapCenterAndZoom.zoom});
    }

  }


  navigationTextIsVisible() {
    // console.log("emptySpace: ", emptySpace);
    if(this.props.HyperSpacePoint.emptySpace) { return true; }
    const pointZoom = this.props.HyperSpacePoint.zoom;
    let textIsVisible = false;
    if(pointZoom === 0) {
      textIsVisible = false;
    } else if(pointZoom === 1) {
      textIsVisible = (this.state.zoom < 3)? true : false;
    } else if(pointZoom === 2) {
      textIsVisible = (this.state.zoom < 5)? true : false;
    } else if(pointZoom === 3) {
      textIsVisible = (this.state.zoom < 6)? true : false;
    } else if(pointZoom > 3) {
      textIsVisible = true;
    }
    return textIsVisible;
  }

  onMouseOver(e) {
    // if(this.refs.nodeHyperSpace && this.refs.nodeText) {
    //   const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
    //   nodeHyperSpace.openPopup();
    // }
  }
  onMouseOut(e) {
    // if(this.refs.nodeHyperSpace && this.refs.nodeText) {
    //   const nodeHyperSpace = this.refs.nodeHyperSpace.leafletElement;
    //   nodeHyperSpace.closePopup();
    // }
  }
  onClick(e) {
    console.log("Clicked navigation point");

  }
  render() {
    const pointColor = 'red';
    // const pointColor = 'teal';
    const HyperspacePointCurrent = this.props.HyperSpacePoint;

    const hyperspacePointLocation = [HyperspacePointCurrent.lat, HyperspacePointCurrent.lng];
    const LocationColorCyan = '#87CEFA';
    const LocationColorPurple = '#c32aff';
    const LocationStartColorGreen = '#49fb35';
    const LocationEndColorRed = '#ff0101';
    const LocationColorBackground = (this.props.isActive)? LocationColorCyan : LocationColorPurple;  
    const LocationColor = (this.props.isStart)? LocationStartColorGreen : LocationEndColorRed;

    console.log("\npointZoom: ", HyperspacePointCurrent.zoom);
    console.log("this.state.zoom: ", this.state.zoom);

    const navTextShouldDisplayStarMap = this.state.starMapState && this.navigationTextIsVisible();
    const navTextShouldDisplay = (!this.state.starMapState) || navTextShouldDisplayStarMap;

    console.log("Star Map is: ", this.state.starMapState);
    console.log("navigationTextIsVisible(): ", this.navigationTextIsVisible());

    console.log("navTextShouldDisplay: ", navTextShouldDisplay);
    console.log("navTextShouldDisplayStarMap: ", navTextShouldDisplayStarMap);

    if(navTextShouldDisplay) {
      console.log("navigation point label should be visible: ", HyperspacePointCurrent.system);
    } else {
      console.log("hiding navigation point label: ", HyperspacePointCurrent.system);
    }
    console.log("\n");

    const currentSystem = HyperspacePointCurrent.system;
    const pointIsEmptySpace = HyperspacePointCurrent.emptySpace;
    const displayedSystem = (pointIsEmptySpace)? emptySpaceDisplayText(currentSystem) : currentSystem;
    const textWidth = width(displayedSystem,  { size: "1em" });

    let textPadding = 0;
    if(textWidth >= 75) {
      textPadding = 30;
    } else if(textWidth < 75 && textWidth > 40) {
      textPadding = 20;
    } else {
      textPadding = 10;
    }

    let myIcon = L.divIcon({
      className: "hyperspaceNodeLabel",
      iconSize: new L.Point(textWidth + textPadding, 24),
      iconAnchor: new L.Point(textWidth / 3.0, 18),
      html: displayedSystem
    });

  	return (
      <div key={HyperspacePointCurrent.system + ":" + uuidv4()}>
        
        
        <CircleMarker key={uuidv4()}  className="expand-ring-pulse-counter" center={hyperspacePointLocation} radius={6} color={LocationColor} weight={2}  onClick={(e) => this.onClick(e)} />

        <CircleMarker key={uuidv4()}  className="expand-ring-pulse" center={hyperspacePointLocation} radius={10} color={LocationColor} weight={2}  onClick={(e) => this.onClick(e)} />


        <If condition={navTextShouldDisplay}>
          <Then>
            <div>
              <CircleMarker  key={uuidv4()} center={hyperspacePointLocation} radius={1} color={pointColor}  onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)}  onClick={(e) => this.onClick(e)} />
              <Marker key={uuidv4()} position={hyperspacePointLocation}  icon={myIcon}  onMouseOver={(e) => this.onMouseOver(e)} onMouseOut={(e) => this.onMouseOut(e)}  zIndexOffset={5}  onClick={(e) => this.onClick(e)} ref='navPointText'/>
            </div> 
          </Then>
          <Else>
            {() => null}
          </Else>
        </If>  
      </div>                  
  	)
  }
}


function emptySpaceDisplayText(locationName) {
  if(locationName.indexOf('@') > -1) {
    const splitNameArray = locationName.split('@');
    let emptySpaceHash = splitNameArray[1];
    const emptySpaceSmallHash = emptySpaceHash.slice(0,7);
    return 'Empty Space ' + emptySpaceSmallHash;
  } else {
    return locationName;
  }
}


// export default HyperspaceNavigationPoint;


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceNavigationPoint);