import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';

import { zoomToLocation, zoomToSector } from '../../../actions/actions.js';
import { noSectorData } from '../../../actions/actionCreators.js';
import '../../../css/main.css';

class SearchSectors extends React.Component {
  constructor() {
    super();
    this.state = {
      sectorValue: undefined
    };
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

    return (
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
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchSectors);