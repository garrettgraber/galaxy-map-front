import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { connect } from 'react-redux';
import urlencode from 'urlencode';
import { findSystem } from '../../actions/actions.js';
import '../../css/main.css';


class SearchData extends React.Component {
  constructor() {
    super();
    this.state = { 
      inputValue: ''
    };
  }
  onChange(e) {
    this.setState({inputValue: e.target.value});
  }
  searchData() {
    if(this.state.inputValue.length > 0) {
      this.props.dispatch(findSystem(this.state.inputValue));
    }
  }
  render() {
    const iconButtonClass = (this.props.searchSystems)? "fa fa-cog fa-spin" : "glyphicon glyphicon-search";
    const buttonClass = (this.props.searchSystems)? "btn navbar-button btn-success" :  "btn navbar-button btn-primary";
    return (
      <div className="control-row nav-section">
        <span>
          <input id="search-system-input" type="text" placeholder="Search For Systems" className="search-input" value={this.state.inputValue}  onChange={(e) => this.onChange(e)} />
          <button id="search-button-icon" type="button" className={buttonClass}  onClick={(e) => this.searchData(e)} disabled={this.props.searchSystems} ><i className={iconButtonClass}></i></button>
        </span>
      </div>
    );
  }
}

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