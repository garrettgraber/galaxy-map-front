import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import urlencode from 'urlencode';
import ReactTooltip from 'react-tooltip';
import VirtualizedSelect from 'react-virtualized-select';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';


import { findSystem, zoomToLocation } from '../../actions/actions.js';
import '../../css/main.css';


class SearchData extends React.Component {
  constructor() {
    super();
    this.state = { 
      inputValue: ''
    };
  }
  onChange(selectValue) {
    // this.setState({inputValue: e.target.value});

    console.log("selectValue: ", selectValue);
    this.setState({ selectValue });
    this.props.dispatch(findSystem(selectValue.value));
  }
  onChangeSector(sectorValue) {
    // this.setState({inputValue: e.target.value});

    console.log("sectorValue: ", sectorValue);
    this.setState({ sectorValue });
    this.props.dispatch(zoomToLocation(sectorValue.value, 6));
  }
  searchData() {
    if(this.state.inputValue.length > 0) {
      this.props.dispatch(findSystem(this.state.inputValue));
    }
  }
  render() {
    const iconButtonClass = (this.props.searchSystems)? "fa fa-cog fa-spin" : "glyphicon glyphicon-search";
    const buttonClass = (this.props.searchSystems)? "btn navbar-button btn-success" :  "btn navbar-button btn-primary";
    
    const selectOptions = [...this.props.systemNameSet];
    const filterOptions = createFilterOptions({ options: selectOptions });

    let sectorSearchArray =  [...this.props.sectorSearchSet];

    sectorSearchArray.sort(function(a, b){
      const sectorA = a.label.toLowerCase();
      const sectorB = b.label.toLowerCase();
      if(sectorA < sectorB) return -1;
      if(sectorA > sectorB) return 1;
      return 0;
    });
    
    // const sectorOptions = [...this.props.sectorSearchSet];
    const filterSectorOptions = createFilterOptions({ options: sectorSearchArray });

    return (
      <div className="control-row nav-section">
          
          <div style={{display: 'inline-block', width: 160, marginLeft: 10}}>
            <Select
              name="selected-system-search"
              filterOptions={filterOptions}
              options={selectOptions}
              onChange={(selectValue) => this.onChange(selectValue)}
              value={this.state.selectValue}
              placeholder="Go To System..."
            />
          </div>

          <div style={{display: 'inline-block', width: 160, marginLeft: 10}}>
            <Select
              name="selected-sector-search"
              filterOptions={filterSectorOptions}
              options={sectorSearchArray}
              onChange={(sectorValue) => this.onChangeSector(sectorValue)}
              value={this.state.sectorValue}
              placeholder="Go To Sector..."
            />
          </div>

      </div>
    );
  }
}



// <input id="search-system-input" type="text" placeholder="Search For Systems" className="search-input" value={this.state.inputValue}  onChange={(e) => this.onChange(e)} />
// <button
//   id="search-button-icon"
//   type="button"
//   className={buttonClass}
//   onClick={(e) => this.searchData(e)}
//   disabled={this.props.searchSystems}
//   data-tip="Search"
//   data-for='search-system-data-toggle'
// >
//   <i className={iconButtonClass}></i>
// </button>
// <ReactTooltip id='search-system-data-toggle' place="top">{}</ReactTooltip>



function findSystemOldSchool(systemName, cb) {
  $.ajax({
    url: "api/search/?system=" + urlencode(systemName),
    type: 'GET',
    success: function(data){ 
      var SystemFound = data[0];
      cb(null, data);
    },
    error: function(error) {
      cb(error, null);
    }
  });
};

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchData);