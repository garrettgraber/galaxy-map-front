import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import _ from 'lodash';
import HyperspaceControls from './hyperspaceControls.js';
import HyperspaceShipDetails from './hyperspaceShipDetails.js';
import JumpGrid from './jumpGrid/jumpGrid.js';
import PivotPoint from './pivotPoint.js';

import {
  allPointsAreValid,
  isPointBlank,
  jumpIntoHyperspaceCalculated
} from '../../hyperspaceNavigation/hyperspaceMethods.js';


import '../../../css/main.css';

class HyperspacePathSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      shipSelectedName: undefined,
      isStartActive: true
    };
  }

  componentDidMount() {}

  endClick(e) {
    this.refs.endNavigationButton.blur();
    if(this.state.isStartActive) {
      this.setState({isStartActive: false});
    }
  }

  startClick(e) {
    this.refs.startNavigationButton.blur();
    if(!this.state.isStartActive) {
      this.setState({isStartActive: true});
    }
  }


  selectFocus(e) {
    if(this.props.mobileStatus) {
      this.props.dispatch(focusSelect());
    }
  }

  selectBlur(e) {
    if(this.props.mobileStatus) {
      this.props.dispatch(blurSelect());
    }
  }

  render() {
    // let hyperspacePathData = [];
    // if(this.props.hyperspacePathCollections.length > 0) {
    //   const FirstHyperspaceCollection = this.props.hyperspacePathCollections[0];
    //   hyperspacePathData = FirstHyperspaceCollection.paths;
    // }
    // const activeHyperspaceJumpPoints = [this.props.hyperspaceActiveStartPoint, this.props.hyperspaceActiveStartNode, this.props.hyperspaceActiveEndPoint, this.props.hyperspaceActiveEndNode];
    // const jumpSuccessfullyCalculated = (hyperspacePathData.length > 0 || allPointsAreValid(activeHyperspaceJumpPoints))? true : false;

    const jumpSuccessfullyCalculated = jumpIntoHyperspaceCalculated({
      hyperspacePathCollections: this.props.hyperspacePathCollections,
      ActiveStartPoint: this.props.hyperspaceActiveStartPoint,
      ActiveStartNode: this.props.hyperspaceActiveStartNode,
      ActiveEndPoint: this.props.hyperspaceActiveEndPoint,
      ActiveEndNode: this.props.hyperspaceActiveEndNode
    });


    const startDefault = 'Coruscant';
    const endDefault = 'Alderaan';
    const mobileModifiler = (this.props.mobileStatus)? 95 : 0;
    const multipleJumpHeight = 520 - mobileModifiler;
    const singleJumpHeight = 463 - mobileModifiler;
    const mobileHeight = 193;
    const desktopHeight = 298;
    const jumpNavigationHeight = (this.props.mobileStatus)? mobileHeight : desktopHeight;
    const navigationPaneStyle = (jumpSuccessfullyCalculated)? {height: singleJumpHeight, overFlow: 'visible'} : {height: jumpNavigationHeight, overFlow: 'visible'};
    const StartPoint = this.props.hyperspaceStartPoint;
    const EndPoint = this.props.hyperspaceEndPoint;
    let startButtonClasses = (isPointBlank(StartPoint))? "btn btn-danger" : "btn btn-success";
    let endButtonClasses = (isPointBlank(EndPoint))? "btn btn-danger" : "btn btn-success";
    startButtonClasses += (this.state.isStartActive)? " glowing-navigation-button" : "";
    endButtonClasses += (!this.state.isStartActive)? " glowing-navigation-button" : "";

    return (
      <div id="hyperspace-navigation-pane" className="control-row" style={navigationPaneStyle}>
        <If condition={this.props.mobileStatus}>
          <Then>
            <div className="pane-container">
              <div className="pane-row-control pane-section">
                <button type="button" className={startButtonClasses} style={{verticalAlign: "top", width: 54, marginRight: 3, marginLeft: 3}}  onClick={(e) => this.startClick(e)} ref="startNavigationButton">Start</button>
                <button type="button" className={endButtonClasses} style={{verticalAlign: "top", width: 54, marginRight: 3, marginLeft: 3}}  onClick={(e) => this.endClick(e)} ref="endNavigationButton">End</button>
                
              </div>
              <If condition={this.state.isStartActive}>
                <Then>
                  <PivotPoint
                    Point={this.props.hyperspaceStartPoint}
                    Node={this.props.hyperspaceStartNode}
                    isStartPosition={true}
                    pointName={'Start'}
                    defaultSystem={startDefault}
                    pinPoint={this.props.pinPointStart}
                    pinPointAlternate={this.props.pinPointEnd}
                    clickSystem={this.props.pathStartClick}
                    clickSystemAlternate={this.props.pathEndClick}
                    map={this.props.map}
                  />
                </Then>
                <Else>
                  <PivotPoint Point={this.props.hyperspaceEndPoint} Node={this.props.hyperspaceEndNode} isStartPosition={false} pointName={'End'} defaultSystem={endDefault} pinPoint={this.props.pinPointEnd} pinPointAlternate={this.props.pinPointStart} clickSystem={this.props.pathEndClick} clickSystemAlternate={this.props.pathStartClick} map={this.props.map}/>
                </Else>
              </If>
              <HyperspaceControls
                StartPoint={this.props.hyperspaceStartPoint}
                EndPoint={this.props.hyperspaceEndPoint}
                ActiveStartPoint={this.props.hyperspaceActiveStartPoint}
                ActiveEndPoint={this.props.hyperspaceActiveEndPoint}
                jumpIsCalculating={this.props.calculateHyperspaceJump}
                hyperspacePathHasChanged={this.props.hyperspacePathChange}
              />
            </div>
          </Then>
          <Else>
            <div className="pane-container">
              <HyperspaceShipDetails />
              <PivotPoint Point={this.props.hyperspaceStartPoint} Node={this.props.hyperspaceStartNode} isStartPosition={true} pointName={'Start'} defaultSystem={startDefault} pinPoint={this.props.pinPointStart} pinPointAlternate={this.props.pinPointEnd} clickSystem={this.props.pathStartClick}  clickSystemAlternate={this.props.pathEndClick} />
              <PivotPoint Point={this.props.hyperspaceEndPoint} Node={this.props.hyperspaceEndNode} isStartPosition={false} pointName={'End'} defaultSystem={endDefault} pinPoint={this.props.pinPointEnd} pinPointAlternate={this.props.pinPointStart} clickSystem={this.props.pathEndClick} clickSystemAlternate={this.props.pathStartClick}   />
              <HyperspaceControls
                StartPoint={this.props.hyperspaceStartPoint}
                EndPoint={this.props.hyperspaceEndPoint}
                ActiveStartPoint={this.props.hyperspaceActiveStartPoint}
                ActiveEndPoint={this.props.hyperspaceActiveEndPoint}
                jumpIsCalculating={this.props.calculateHyperspaceJump}
                hyperspacePathHasChanged={this.props.hyperspacePathChange}
              />
            </div>
          </Else>
        </If>
        <If condition={jumpSuccessfullyCalculated}>
          <Then>
            <JumpGrid  map={this.props.map}/>
          </Then>
          <Else>{() => null }</Else>
        </If>
      </div>
    );
  }
}


function getCorrectPath(startNode, endNode, pathsArray) {
  return _.filter(pathsArray, function(path) { 
    return (path.start === startNode && path.end === endNode); 
  });
}




const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};
export default connect(mapStateToProps)(HyperspacePathSearch);