import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import {
  zoomToSector
} from '../../../actions/actions.js';
import {
  noSectorData,
  addItemToDataStream
} from '../../../actions/actionCreators.js';
import '../../../css/main.css';

class SearchSectors extends React.Component {
  constructor() {
    super();
    this.state = {
      sectorValue: undefined,
      componentId: uuidv4()
    };
  }
  componentDidMount() {
    if(this.props.sectorSearchData.name !== null) {
      const sectorSearchArray =  [...this.props.sectorSearchSet];
      const sectorValue = sectorSearchArray.find(e => e.label === this.props.sectorSearchData.name);
      this.setState({ sectorValue });
    }
  }
  onChange(sectorValue) {  
    if(sectorValue === null) {
      this.setState({sectorValue: undefined});
      this.props.dispatch(noSectorData());
    } else {
      this.setState({ sectorValue });
      this.props.dispatch(zoomToSector(sectorValue, 6));
    }
  }
  zoomToPoint(e) {
    if(this.state.sectorValue) {
      const dataStreamMessage = "Zoomed to " + this.state.sectorValue.label + ' Sector ...';
      const map = this.props.map;
      map.fitBounds(this.props.SearchBoundaries);
      this.props.dispatch(addItemToDataStream(dataStreamMessage));
    }
  }
  render() {
    let sectorSearchArray =  [...this.props.sectorSearchSet];
    sectorSearchArray.sort(function(a, b){
      const sectorA = a.label.toLowerCase();
      const sectorB = b.label.toLowerCase();
      if(sectorA < sectorB) return -1;
      if(sectorA > sectorB) return 1;
      return 0;
    });
    const filterSectorOptions = createFilterOptions({ options: sectorSearchArray });
    const tooltipZoomText = (this.state.sectorValue)? 'Zoom to the ' + this.state.sectorValue.label + ' Sector' : 'No Sector selected';
    const pointZoom = (this.state.sectorValue)? 'btn hyperspace-navigation-button btn-success' : 'btn hyperspace-navigation-button btn-danger';

    return (
      <div style={{display: 'inline-block'}}>
        <div style={{display: 'inline-block', width: 180, marginLeft: 10}}>
          <Select
            name="selected-sector-search"
            filterOptions={filterSectorOptions}
            options={sectorSearchArray}
            onChange={(sectorValue) => this.onChange(sectorValue)}
            value={this.state.sectorValue}
            placeholder="Go To Sector..."
          />
        </div>
        <span>
          <button type="button" className={pointZoom} style={{verticalAlign: "top", marginLeft: 10}} onClick={(e) => this.zoomToPoint(e)}   data-tip={tooltipZoomText}  data-for={'go-to-sector-from-search' + this.state.componentId}>
            <i className={"fa fa-bullseye"} ></i>
          </button>
          <ReactTooltip id={'go-to-sector-from-search' + this.state.componentId} place="right">{}</ReactTooltip>
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchSectors);