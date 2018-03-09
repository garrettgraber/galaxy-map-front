import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { If, Then, Else } from 'react-if';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import {
  noSectorData,
  noSystemsLocation,
  setDefaultActiveSystem
} from '../../../actions/actionCreators.js';

import SearchSystems from './searchSystems.js';
import SearchSectors from './searchSectors.js';

class SearchData extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSearchValue: {
        value: '',
        label: 'Search For...'
      },
      componentId: uuidv4()
    };
  }

  componentDidMount() { }

  onChange(selectedSearchValue) {
    if(this.state.selectedSearchValue.value === 'systems') {
      this.props.dispatch(setDefaultActiveSystem());
    }
    if(this.state.selectedSearchValue.value === 'sectors') {
      this.props.dispatch(noSectorData());
    }
    if(selectedSearchValue === null) {
      this.setState({
        selectedSearchValue: {
          value: '',
          label: 'Search For...'
        }
      });
      this.props.dispatch(noSystemsLocation());
    } else {
      this.setState({ selectedSearchValue });
    }
  }
  render() {
    const { selectedSearchValue } = this.state;
    const searchingSystems = selectedSearchValue && selectedSearchValue.value === 'systems';
    const searchingSectors = selectedSearchValue && selectedSearchValue.value === 'sectors';

    return (
      <div id="search-data" className="control-row nav-section">
        <div style={{display: 'inline-block', width: 140, marginLeft: 5}}>
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
        <If condition={ searchingSystems }>
          <Then>
            <SearchSystems/>
          </Then>
          <Else>{() => null}</Else>
        </If>
        <If condition={ searchingSectors }>
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