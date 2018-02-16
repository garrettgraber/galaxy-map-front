import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { If, Then, Else } from 'react-if';


import '../../css/main.css';
import {
  setMapToZeroZero,
  addItemToDataStream,
  increaseMapZoom,
  decreaseMapZoom
} from '../../actions/actionCreators.js';

import GalaxyIconOnEdge from '../../images/icons/randomly-found/galaxy.png';


class MapNavigationControl extends React.Component {
  constructor() {
    super();

    this.state = {
      mapControlsOn: true
    }
  }
  componentDidMount() { }
  goHome() {
    if(this.props.mapCenterAndZoom.zoom > 2) {
      this.props.dispatch(addItemToDataStream('Moved to Galaxy View...'));
      this.props.dispatch(setMapToZeroZero());
    }
  }
  handleUpPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([0, -100]);
    }
  }
  handleRightPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([100, 0]);
    }
  }
  handleLeftPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      map.panBy([-100, 0]);
    }
  }
  handleDownPanClick() {
    const map = this.props.map;
    if(this.props.mapCenterAndZoom.zoom > 2) {
      const mapBoundsBeforeMove = map.getBounds();
      let point = L.point(0, 100); // x=0,y=0
      let latlng = map.layerPointToLatLng(point);
      map.panBy(point, {animate: true, duration: 0.25, noMoveStart: true});
    }
  }
  increaseZoom() {
    this.props.dispatch( increaseMapZoom() );
  }
  decreaseZoom() {
    this.props.dispatch( decreaseMapZoom() );
  }
  mapControlsToggle(e) {
    console.log("Closing map controls");
    const mapControlsOn = this.state.mapControlsOn;
    this.setState({mapControlsOn: !mapControlsOn});
    console.log("Map Controls toggle: ", this.state.mapControlsOn);

  }
  
	render() {

    const bottomBase = 40;

    const mapControlsButtonPositionRight = (this.state.mapControlsOn)? 170 : 0;
    const mapControlsButtonClasses = (this.state.mapControlsOn)? "btn btn-success" : "btn btn-danger";
    const mapControlsButtonMessage = (this.state.mapControlsOn)? "Close Map Tools" : "Open Map Tools";

    return (
      <div>

        <div style={{position: "fixed", bottom: bottomBase + 65, right: mapControlsButtonPositionRight, width: 40, height: 40, zIndex: 12}}>

          <button
            type="button"
            className={mapControlsButtonClasses}
            onClick={(e) => this.mapControlsToggle(e)}
            data-tip={mapControlsButtonMessage}
            data-for="close-map-tools-toggle-navigation"
            style={{width: 40, height: 40, borderRadius: 20}}
          >
            <i className="fa fa-map-marker"></i>
          </button>
          <ReactTooltip id='close-map-tools-toggle-navigation' place="top">{}</ReactTooltip>

        </div>


        <If condition={ this.state.mapControlsOn }>
            <Then>
              <div style={{bottom: bottomBase, right: 10, height: 220, width: 160, zIndex: 11, position: 'fixed'}}>

                <div style={{height: 40}}>
                  <div  style={{height: '100%', width: '50%', display: 'inline-block'}}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{verticalAlign: "top", float: 'right', borderTopLeftRadius: 25, borderBottomLeftRadius: 25,  width: "80%"}}
                      onClick={(e) => this.decreaseZoom(e)}
                      data-tip="Zoom Out"
                      data-for="zoom-out-toggle-navigation"
                    >
                      <i className="fa fa-minus-circle"></i>
                    </button>
                    <ReactTooltip id='zoom-out-toggle-navigation' place="top">{}</ReactTooltip>


                  </div>
                  <div  style={{height: '100%', width: '50%', display: 'inline-block'}}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{verticalAlign: "top", float: 'left', width: "80%", borderTopRightRadius: 25, borderBottomRightRadius: 25 }}
                      onClick={(e) => this.increaseZoom(e)}
                      data-tip="Zoom In"
                      data-for="zoom-in-toggle-navigation"
                    >
                      <i className="fa fa-plus-circle"></i>
                    </button>
                    <ReactTooltip id='zoom-in-toggle-navigation' place="top">{}</ReactTooltip>


                  </div>          
                </div>

                <div style={{height: 160, position: 'fixed', bottom: bottomBase + 5}}>

                  <div id="circle" className="rotate-circle">
                    
                    <div id="q1" className="quarter map-navigation-pan" onClick={e => this.handleUpPanClick(e)}>
                      <i className="fa fa-angle-double-left"   style={{ position: 'relative', top: '30%', left: '40%', transform: 'rotate(45deg)', fontSize: '28pt' }} ></i>
                    </div>
                    <div id="q2" className="quarter map-navigation-pan" onClick={e => this.handleRightPanClick(e)}  data-tip="Pan Right" data-for="pan-right-navigation-toggle" ><i className="fa fa-angle-double-up"  style={{ position: 'relative', top: '30%', left: '30%', transform: 'rotate(45deg)', fontSize: '28pt' }}></i>
                    </div>
                    <div id="q3" className="quarter map-navigation-pan" onClick={e => this.handleLeftPanClick(e)} data-tip="Pan Left" data-for="pan-left-navigation-toggle" ><i className="fa fa-angle-double-down"   style={{ position: 'relative', top: '20%', left: '40%', transform: 'rotate(45deg)', fontSize: '28pt' }}></i>
                    </div>

                    <div id="q4" className="quarter map-navigation-pan" onClick={e => this.handleDownPanClick(e)}><i className="fa fa-angle-double-right"   style={{ position: 'relative', top: '18%', left: '30%', transform: 'rotate(45deg)', fontSize: '28pt' }}></i>
                    </div>
                  </div>
                </div>

                <div style={{height: 50, width: 50, borderRadius: 25, position: 'fixed', bottom: bottomBase + 60, right: 63, zIndex: 12}}>

                  <button
                    style={{ width: 50, height: 50, fontSize: 18, lineHeight: 1.33, borderRadius: 25, backgroundColor: 'black', verticalAlign: 'middle', display: 'block',  margin: '0 auto', position: 'relative'}}
                    onClick={e => this.goHome(e)}
                    data-tip="Galaxy View"
                    data-for="galaxy-view-toggle-navigation"
                    >
                    <img  id="galaxy-view-toggle-navigation-image" style={{width: 25, height: 25}} src={GalaxyIconOnEdge} />
                  </button>
                  <ReactTooltip id='galaxy-view-toggle-navigation' place="top">{}</ReactTooltip>
                </div>
              </div>
            </Then>
            <Else>{() => null }</Else>
        </If>

      </div>

    );
  }
}



const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(MapNavigationControl);