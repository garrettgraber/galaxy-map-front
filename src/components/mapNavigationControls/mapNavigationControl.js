import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

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
  }
  componentDidMount() { 
    console.log("MapNavigationControl has Mounted");
  }
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

  testClick() {
    console.log("Test click");
  }
  
	render() {
    return (
      <div style={{bottom: 10, right: 10, height: 220, width: 160, zIndex: 11, position: 'fixed', border: '1px solid gold'}}>

        <div style={{height: 40}}>
          <div  style={{height: '100%', width: '50%', display: 'inline-block', border: '1px solid red'}}>
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
          <div  style={{height: '100%', width: '50%', display: 'inline-block', border: '1px solid red'}}>
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

        <div style={{height: 160, border: '1px solid purple', position: 'fixed', bottom: 15}}>

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

        <div style={{height: 50, width: 50, borderRadius: 25, border: '1px solid green', position: 'fixed', bottom: 70, right: 63, zIndex: 12}}>

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
    );
  }
}



// <span >
//   <button
//     id="home-button-icon"
//     type="button"
//     className="btn btn-primary navbar-button"
//     onClick={e => this.goHome(e)}
//     data-tip="Galaxy View"
//     data-for="galaxy-view-toggle"            
//   >
//     <i className="glyphicon glyphicon-home"></i>
//   </button>
//   <ReactTooltip id='galaxy-view-toggle' place="right">{}</ReactTooltip>

//   <button
//     className="btn btn-primary navbar-button"
//     onClick={e => this.handleLeftPanClick(e)}
//     data-tip="Pan Left"
//     data-for="pan-left-toggle"
//   >
//     Left
//   </button>
//   <ReactTooltip id='pan-left-toggle' place="right">{}</ReactTooltip>
//   <button
//     className="btn btn-primary navbar-button"
//     onClick={e => this.handleRightPanClick(e)}
//     data-tip="Pan Right"
//     data-for="pan-right-toggle"
//   >
//     Right
//   </button>
//   <ReactTooltip id='pan-right-toggle' place="right">{}</ReactTooltip>
//   <button
//     className="btn btn-primary navbar-button"
//     onClick={e => this.handleUpPanClick(e)}
//     data-tip="Pan Up"
//     data-for="pan-up-toggle"
//   >
//     Up
//   </button>
//   <ReactTooltip id='pan-up-toggle' place="right">{}</ReactTooltip>

//   <button
//     className="btn btn-primary navbar-button"
//     onClick={e => this.handleDownPanClick(e)}
//     data-tip="Pan Down"
//     data-for="pan-down-toggle"
//   >
//     Down
//   </button>
//   <ReactTooltip id='pan-down-toggle' place="right">{}</ReactTooltip>

//   <button
//     className="btn btn-primary navbar-button"
//     onClick={e => this.increaseZoom(e)}
//     data-tip="Zoom In"
//     data-for="zoom-in-toggle"
//   >
//     +
//   </button>
//   <ReactTooltip id='zoom-in-toggle' place="right">{}</ReactTooltip>

//   <button
//     className="btn btn-primary navbar-button"
//     onClick={e => this.decreaseZoom(e)}
//     data-tip="Zoom Out"
//     data-for="zoom-out-toggle"
//   >
//     -
//   </button>
//   <ReactTooltip id='zoom-out-toggle' place="right">{}</ReactTooltip>

// </span>





const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(MapNavigationControl);