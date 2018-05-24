import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
import { If, Then, Else } from 'react-if';

import { getSearchStyles } from './searchStyles.js';
import {
  findHyperspaceRoute
} from '../../../actions/actions.js';
import {
  addItemToDataStream,
  noHyperspaceRoute,
  focusSelect,
  blurSelect
} from '../../../actions/actionCreators.js';
import '../../../css/main.css';

class SearchHyperspaceLanes extends React.Component {
  constructor() {
    super();
    this.state = {
      laneValue: undefined,
      componentId: uuidv4(),
    };
  }

  componentDidMount() {
    if(this.props.hyperspaceRouteSearchData.name !== null) {
      this.setState({
        laneValue: {
          value: this.props.hyperspaceRouteSearchData.name,
          label: this.props.hyperspaceRouteSearchData.name
        }
      });
    }
  }

  onChange(laneValue) {  
    if(laneValue === null) {
      this.setState({laneValue: undefined});
      this.props.dispatch(noHyperspaceRoute());
    } else {
      this.setState({ laneValue });
      this.props.dispatch(noHyperspaceRoute());
      this.props.dispatch(findHyperspaceRoute(laneValue.value));
      this.refs.zoomToButton.focus();
    }
  }
  
  zoomToPoint(e) {
    this.refs.zoomToButton.blur();
    if(this.state.laneValue) {
      const dataStreamMessage = "Zoomed to the " + this.props.hyperspaceRouteSearchData.name;
      const map = this.props.map;

      const FitBoundsOptions = getFitBounds(this.props.mobileStatus, this.props.hyperspaceNavigationControlsOn);


      map.fitBounds(this.props.SearchBoundaries, FitBoundsOptions);
      this.props.dispatch(addItemToDataStream(dataStreamMessage));
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
    let laneSearchArray =  [...this.props.hyperspaceRouteNameSet];
    laneSearchArray.sort(function(a, b){
      const laneA = a.label.toLowerCase();
      const laneB = b.label.toLowerCase();
      if(laneA < laneB) return -1;
      if(laneA > laneB) return 1;
      return 0;
    });
    const filterLaneOptions = createFilterOptions({ options: laneSearchArray });
    const tooltipZoomText = (this.state.laneValue)? 'Zoom to the ' + this.state.laneValue.label : 'No Lane selected';
    const pointZoom = (this.state.laneValue)? 'btn btn-success' : 'btn btn-danger';
    const Styles = getSearchStyles(this.props.mobileStatus);
    const selectedLane = (this.state.laneValue)? this.state.laneValue.label : null;

    return (
      <div style={Styles.SearchContainer}>
        <div style={Styles.SearchSelect}>
          <Select
            name="selected-lane-search"
            filterOptions={filterLaneOptions}
            options={laneSearchArray}
            onChange={(laneValue) => this.onChange(laneValue)}
            value={this.state.laneValue}
            placeholder="Go To Hyperspace Route..."
            autoBlur={true}
            onFocus={(e) => this.selectFocus(e)}
            onBlur={(e) => this.selectBlur(e)}
          />
        </div>
        <span>
          <button type="button" className={pointZoom} style={Styles.SearchButton} onClick={(e) => this.zoomToPoint(e)}   data-tip={tooltipZoomText}  data-for={'go-to-sector-from-search' + this.state.componentId} ref="zoomToButton">
            <If condition={ this.props.mobileStatus && selectedLane !== null}>
              <Then>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;Zoom to the {selectedLane}&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </Then>
              <Else><i className={"fa fa-bullseye"} ></i></Else>
            </If>
          </button>
          <ReactTooltip id={'go-to-lane-from-search' + this.state.componentId} place="right" disable={this.props.mobileStatus}>{}</ReactTooltip>
        </span>
      </div>
    );
  }
}



function getFitBounds(mobileStatus, navigationControls) {
  if(mobileStatus) {
    return {
      paddingTopLeft: [0, 160]
    };
  } else if(navigationControls) {
    return {
      paddingTopLeft: [400, 0]
    };
  } else {
    return {};
  }
}



const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchHyperspaceLanes);