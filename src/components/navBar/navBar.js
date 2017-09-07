import React from 'react';
import { connect } from 'react-redux';
import SearchData from './searchData.js';
import HyperspacePathSearch from './hyperspacePathSearch.js';
import '../../css/main.css';
import { setZoomValue, zoomToSystem, getZoomValue, generateNewMapHash } from '../../actions/actionCreators.js';
import { findSystem } from '../../actions/actions.js';

class NavBar extends React.Component {
  componentDidMount() {  }
  goHome() {
    console.log("goHome has fired: ", this.props);
    this.props.currentSystem.lat = 0.0;
    this.props.currentSystem.lng = 0.0;
    this.props.currentSystem.system = "Coruscant";
    console.log("store zoom: ", this.props.zoom);
    this.props.dispatch(setZoomValue(2));
    // this.props.dispatch(findSystem('Coruscant'));
  }
  handleUpPanClick() {
    const map = this.props.map;
    map.panBy([0, -100]);
    console.log('Panning up');
  }
  handleRightPanClick() {
    const map = this.props.map;
    map.panBy([100, 0]);
    console.log('Panning right');
  }
  handleLeftPanClick() {
    const map = this.props.map;
    map.panBy([-100, 0]);
    console.log('Panning left');
  }
  handleDownPanClick() {
    const map = this.props.map;
    map.panBy([0, 100]);
    console.log('Panning down');
  }
  componentDidMount() {
    console.log("NavBar has Mounted");
  }
	render() {
    console.log("NavBar props: ", this.props);
    // if (this.props.hyperspaceStartPoint.lat && this.props.hyperspaceStartPoint.lng) {
    //   const HyperspaceStartPoint = this.props.hyperspaceStartPoint;
    //   start = <span className="nav-text">Start:&nbsp;&nbsp;{this.props.}</span>;
    // } else {
    //   end = <LoginButton onClick={this.handleLoginClick} />;
    // }
    return (
      <div id="control-container">
        <div className="control-row nav-section">
          <SearchData/>
        </div>
        <div className="control-row nav-section" >
          <button id="home-button-icon" type="button" className="btn btn-primary navbar-button"  onClick={e => this.goHome(e)} ><i className="glyphicon glyphicon-home"></i></button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleLeftPanClick(e)}>
              Left
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleRightPanClick(e)}>
              Right
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleUpPanClick(e)}>
              Up
            </button>
            <button className="btn btn-primary navbar-button" onClick={e => this.handleDownPanClick(e)}>
              Down
            </button>
            <span className="nav-text">Zoom:&nbsp;&nbsp;{this.props.zoom - 1}</span>
        </div>
        <div className="control-row nav-detail-pane">
          <HyperspacePathSearch/>
        </div>
      </div>
    );
  }
}


// function positionDisplay(HyperspacePoint) {
//   let pointDisplayEl = null;
//   if (HyperspacePoint.lat && HyperspacePoint.lng) {
//     pointDisplayEl = <span className="nav-text">{(HyperspacePoint.)}:&nbsp;&nbsp;{HyperspacePoint}</span>;
//   }
// }


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};
// export default NavBar;
export default connect(mapStateToProps)(NavBar);