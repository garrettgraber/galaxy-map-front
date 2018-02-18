import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { If, Then, Else } from 'react-if';

import SearchSystems from './searchSystems.js';
import SearchSectors from './searchSectors.js';

class SearchData extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSearchValue: {
        value: '',
        label: ''
      }
    };
  }
  onChange(selectedSearchValue) {
    if(selectedSearchValue === null) {
      this.setState({
        selectedSearchValue: {
          value: '',
          label: ''
        }
      });
    } else {
      this.setState({ selectedSearchValue });
    }
  }
  render() {
    const { selectedSearchValue } = this.state;
    return (
      <div className="control-row nav-section">
        <div style={{display: 'inline-block', width: 180, marginLeft: 10}}>
          <Select
            name="search-selection-type"
            value={this.state.selectedSearchValue}
            onChange={(selectValue) => this.onChange(selectValue)}
            options={[
              { value: 'systems', label: 'Systems' },
              { value: 'sectors', label: 'Sectors' },
            ]}
          />
        </div>
        <If condition={ selectedSearchValue && selectedSearchValue.value === 'systems' }>
          <Then>
            <SearchSystems/>
          </Then>
          <Else>{() => null}</Else>
        </If>
        <If condition={ selectedSearchValue && selectedSearchValue.value === 'sectors' }>
          <Then>
            <SearchSectors/>
          </Then>
          <Else>{() => null}</Else>
        </If>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchData);