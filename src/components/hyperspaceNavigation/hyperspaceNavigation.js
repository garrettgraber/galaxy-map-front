import React from 'react';
import { connect } from 'react-redux';
import {
  Pane,
  FeatureGroup,
  LayerGroup
} from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import '../../css/main.css';

import PathGenerator from '../../classes/pathGenerator.js';
import {
  stopUpdatingHyperspacePath,
  hyperspaceNavigationUpdateOff
} from '../../actions/actionCreators.js';


class HyperspaceNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HyperspaceCollectionsComponents: [],
      HSpaceComponentsMaster: [],
    };
  }

  componentDidMount() { }

  componentWillReceiveProps(newProps) {
    if(newProps.update) {
      const CurentPathGenerator = new PathGenerator(
        newProps.hyperspaceActiveStartPoint,
        newProps.hyperspaceActiveEndPoint,
        newProps.hyperspaceActiveStartNode,
        newProps.hyperspaceActiveEndNode,
        newProps.hyperspaceStartPoint,
        newProps.hyperspaceEndPoint,
        this.props.hyperspaceStartNode,
        this.props.hyperspaceEndNode,
        newProps.activeHyperspaceJump,
        newProps.hyperspaceHash,
        this.state.HyperspaceCollectionsComponents,
        newProps.hyperspacePathCollections,
        newProps.hyperspacePathChange
      );
      CurentPathGenerator.generateNavigationComponents();
      if(CurentPathGenerator.pathUpdateAndHyperspaceJumpsInArray()){
        this.setState(
          {
            HyperspaceCollectionsComponents: CurentPathGenerator.HyperspaceCollectionsComponents
          }
        );
      }
      if(CurentPathGenerator.hyperspacePathChange) {
        this.props.dispatch(stopUpdatingHyperspacePath());
      }
      this.setState({HSpaceComponentsMaster: CurentPathGenerator.navComponentsRendered});
      this.props.dispatch(hyperspaceNavigationUpdateOff());
    }
  }

  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
  	const zIndex = 260;
    const zIndexAntPath = 259;
    const navComponents = renderComponentsOrNull(this.state.HSpaceComponentsMaster);

  	return (
      <LayerGroup>
        <Pane name="hyperspace-navigation-pane" style={{ zIndex: zIndex }}>
          <FeatureGroup> 
            { navComponents }
          </FeatureGroup>
        </Pane>
      </LayerGroup>
  	)
  }
}


function renderComponentsOrNull(currentComponents) {
  if(currentComponents && currentComponents.length > 1) {
    return currentComponents;
  } else if(currentComponents && currentComponents.length === 1){
    return currentComponents[0];
  } else {
    return null;
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceNavigation);