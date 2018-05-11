import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
import { If, Then, Else } from 'react-if';

import * as SearchStyles from './searchStyles.js';

import {
  findHyperspaceRoute
} from '../../../actions/actions.js';
import {
  addItemToDataStream,
  noHyperspaceRoute
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
      map.fitBounds(this.props.SearchBoundaries);
      this.props.dispatch(addItemToDataStream(dataStreamMessage));
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
    const tooltipZoomText = (this.state.laneValue)? 'Zoom to the ' + this.state.laneValue.label  : 'No Lane selected';
    const pointZoom = (this.state.laneValue)? 'btn btn-success' : 'btn btn-danger';



    const ActiveSearchSystemsStyles = (this.props.mobileStatus)? SearchStyles.SearchSystemsStylesMobile : SearchStyles.SearchSystemsStyles;
    const ActiveSearchSystemsSelectStyles = (this.props.mobileStatus)? SearchStyles.SearchSystemsSelectStylesMobile : SearchStyles.SearchSystemsSelectStyles;
    const ActiveSearchButtonStyles = (this.props.mobileStatus)? SearchStyles.SearchButtonStylesMobile : SearchStyles.SearchButtonStyles;
    const selectedLane = (this.state.laneValue)? this.state.laneValue.label : null;


    return (
      <div style={ActiveSearchSystemsStyles}>
        <div style={ActiveSearchSystemsSelectStyles}>
          <Select
            name="selected-lane-search"
            filterOptions={filterLaneOptions}
            options={laneSearchArray}
            onChange={(laneValue) => this.onChange(laneValue)}
            value={this.state.laneValue}
            placeholder="Go To Hyperspace Route..."
            autoBlur={true}
          />
        </div>

        <span>
          <button type="button" className={pointZoom} style={ActiveSearchButtonStyles} onClick={(e) => this.zoomToPoint(e)}   data-tip={tooltipZoomText}  data-for={'go-to-sector-from-search' + this.state.componentId} ref="zoomToButton">
            <If condition={ this.props.mobileStatus && selectedLane !== null}>
              <Then>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;Zoom to the {selectedLane}&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </Then>
              <Else><i className={"fa fa-bullseye"} ></i></Else>
            </If>
          </button>
          <If condition={ this.props.mobileStatus }>
            <Then>{() => null}</Then>
            <Else>
              <ReactTooltip id={'go-to-lane-from-search' + this.state.componentId} place="right">{}</ReactTooltip>
            </Else>
          </If>
        </span>

      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchHyperspaceLanes);