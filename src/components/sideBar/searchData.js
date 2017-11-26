import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { connect } from 'react-redux';
import urlencode from 'urlencode';
import ReactTooltip from 'react-tooltip';
import VirtualizedSelect from 'react-virtualized-select';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';


import { findSystem } from '../../actions/actions.js';
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

    return (
      <div className="control-row nav-section">
          
          <div style={{display: 'inline-block', width: 200, marginRight: 3}}>

            <Select
              name="selected-system-search"
              filterOptions={filterOptions}
              options={selectOptions}
              onChange={(selectValue) => this.onChange(selectValue)}
              value={this.state.selectValue}
            />

          </div>

          <div style={{display: 'inline-block', width: 100, verticalAlign: 'top', marginLeft: 2}}>

            <button
              id="search-button-icon"
              type="button"
              className={buttonClass}
              onClick={(e) => this.searchData(e)}
              disabled={this.props.searchSystems}
              data-tip="Zoom To Selected"
              data-for='search-system-data-toggle'
              style={{height: 36, width: 40}}
            >
              <i className={iconButtonClass}></i>
            </button>
            <ReactTooltip id='search-system-data-toggle' place="top">{}</ReactTooltip>

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