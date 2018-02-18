import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';

import { findSystem } from '../../../actions/actions.js';
import '../../../css/main.css';

class SearchSystems extends React.Component {
  constructor() {
    super();
    this.state = {
      selectValue: undefined
    };
  }
  onChange(selectValue) {
    if(selectValue === null) {
      this.setState({selectValue: undefined});
    } else {
      this.setState({ selectValue });
      this.props.dispatch(findSystem(selectValue.value));
    }
  }
  render() {
    const selectOptions = [...this.props.systemNameSet];
    const filterOptions = createFilterOptions({ options: selectOptions });
    return (
      <div style={{display: 'inline-block', width: 180, marginLeft: 10}}>
        <Select
          name="selected-system-search"
          filterOptions={filterOptions}
          options={selectOptions}
          onChange={(selectValue) => this.onChange(selectValue)}
          value={this.state.selectValue}
          placeholder="Go To System..."
        />
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchSystems);