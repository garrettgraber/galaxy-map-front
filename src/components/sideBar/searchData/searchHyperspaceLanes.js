import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import { zoomToLocation, zoomToSector } from '../../../actions/actions.js';
import { noSectorData, addItemToDataStream, setMapCenterAndZoom } from '../../../actions/actionCreators.js';
import '../../../css/main.css';

class SearchHyperspaceLanes extends React.Component {
  constructor() {
    super();
    this.state = {
      laneValue: undefined,
      componentId: uuidv4()
    };
  }
  onChange(laneValue) {  
    if(laneValue === null) {
      this.setState({laneValue: undefined});
      // this.props.dispatch(noSectorData());
    } else {
      this.setState({ laneValue });
      // this.props.dispatch(zoomToSector(laneValue, 6));
    }
  }
  zoomToPoint(e) {
    if(this.state.laneValue) {
      const newZoom = 6;
      const dataStreamMessage = "Zoomed to " + this.state.laneValue.label + ' Sector ...';
      // this.props.dispatch( addItemToDataStream(dataStreamMessage) );
      // this.props.dispatch(setMapCenterAndZoom(this.state.laneValue.value, newZoom));
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
    const pointZoom = (this.state.laneValue)? 'btn hyperspace-navigation-button btn-success' : 'btn hyperspace-navigation-button btn-danger';

    return (
      <div style={{display: 'inline-block'}}>
        <div style={{display: 'inline-block', width: 180, marginLeft: 10}}>
          <Select
            name="selected-lane-search"
            filterOptions={filterLaneOptions}
            options={laneSearchArray}
            onChange={(laneValue) => this.onChange(laneValue)}
            value={this.state.laneValue}
            placeholder="Go To Hyperspace Route..."
          />
        </div>
        <span>
          <button type="button" className={pointZoom} style={{verticalAlign: "top", marginLeft: 10}} onClick={(e) => this.zoomToPoint(e)}   data-tip={tooltipZoomText}  data-for={'go-to-lane-from-search' + this.state.componentId}>
            <i className={"fa fa-bullseye"} ></i>
          </button>
          <ReactTooltip id={'go-to-lane-from-search' + this.state.componentId} place="right">{}</ReactTooltip>
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchHyperspaceLanes);