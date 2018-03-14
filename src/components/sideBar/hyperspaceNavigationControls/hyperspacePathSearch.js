import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import HyperspaceControls from './hyperspaceControls.js';
import HyperspaceShipDetails from './hyperspaceShipDetails.js';
import JumpGrid from './jumpGrid/jumpGrid.js';
import PivotPoint from './pivotPoint.js';
import '../../../css/main.css';

class HyperspacePathSearch extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() { }
  render() {
    let hyperspacePathData = [];
    if(this.props.hyperspacePathCollections.length > 0) {
      const FirstHyperspaceCollection = this.props.hyperspacePathCollections[0];
      hyperspacePathData = FirstHyperspaceCollection.paths;
    }
    const startDefault = 'Kamino';
    const endDefault = 'Lok'
    return (
      <div id="hyperspace-navigation-pane" className="control-row">
        <HyperspaceShipDetails />
        <HyperspaceControls
          StartPoint={this.props.hyperspaceStartPoint}
          EndPoint={this.props.hyperspaceEndPoint}
          ActiveStartPoint={this.props.hyperspaceActiveStartPoint}
          ActiveEndPoint={this.props.hyperspaceActiveEndPoint}
          jumpIsCalculating={this.props.calculateHyperspaceJump}
          hyperspacePathHasChanged={this.props.hyperspacePathChange}
        />
        <PivotPoint Point={this.props.hyperspaceStartPoint} Node={this.props.hyperspaceStartNode} isStartPosition={true} pointName={'Start'} defaultSystem={startDefault} pinPoint={this.props.pinPointStart} pinPointAlternate={this.props.pinPointEnd} clickSystem={this.props.pathStartClick}  clickSystemAlternate={this.props.pathEndClick} />
        <PivotPoint Point={this.props.hyperspaceEndPoint} Node={this.props.hyperspaceEndNode} isStartPosition={false} pointName={'End'} defaultSystem={endDefault} pinPoint={this.props.pinPointEnd} pinPointAlternate={this.props.pinPointStart} clickSystem={this.props.pathEndClick} clickSystemAlternate={this.props.pathStartClick}   />
        <If condition={ hyperspacePathData.length > 0 }>
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