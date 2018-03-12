import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { If, Then, Else } from 'react-if';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

import {
  noSectorData,
  noSystemsLocation,
  setDefaultActiveSystem,
  noHyperspaceRoute,
  setSearchValueToSystems,
  setSearchValueToSectors,
  setSearchValueToLanes,
  setSearchValueToNothing
} from '../../../actions/actionCreators.js';

import SearchSystems from './searchSystems.js';
import SearchSectors from './searchSectors.js';
import SearchHyperspaceLanes from './searchHyperspaceLanes.js';

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

  componentDidMount() {
    if(this.props.currentSeachValue === 'systems') {
      this.setState({
        selectedSearchValue: {
          value: 'systems',
          label: 'Systems'
        }
      });
    }
    if(this.props.currentSeachValue === 'sectors') {
      this.setState({
        selectedSearchValue: {
          value: 'sectors',
          label: 'Sectors'
        }
      });
    }
    if(this.props.currentSeachValue === 'lanes') {
      this.setState({
        selectedSearchValue: {
          value: 'lanes',
          label: 'Hyperspace Lanes'
        }
      });
    }
  }

  onChange(selectedSearchValue) {

    if(selectedSearchValue && selectedSearchValue.value === 'systems') {
      this.props.dispatch(setSearchValueToSystems());
    }
    if(selectedSearchValue && selectedSearchValue.value === 'sectors') {
      this.props.dispatch(setSearchValueToSectors());
    }
    if(selectedSearchValue && selectedSearchValue.value === 'lanes') {
      this.props.dispatch(setSearchValueToLanes());
    }
    if(this.state.selectedSearchValue.value === 'systems') {
      this.props.dispatch(setDefaultActiveSystem());
    }
    if(this.state.selectedSearchValue.value === 'sectors') {
      this.props.dispatch(noSectorData());
    }
    if(this.state.selectedSearchValue.value === 'lanes') {
      this.props.dispatch(noHyperspaceRoute());
    }

    if(selectedSearchValue === null) {
      this.setState({
        selectedSearchValue: {
          value: '',
          label: 'Search For...'
        }
      });
      this.props.dispatch(noSystemsLocation());
      this.props.dispatch(setDefaultActiveSystem());
      this.props.dispatch(noSectorData());
      this.props.dispatch(noHyperspaceRoute());
      this.props.dispatch(setSearchValueToNothing());
    } else {
      this.setState({ selectedSearchValue });
    }
  }
  render() {
    const { selectedSearchValue } = this.state;
    const searchingSystems = selectedSearchValue && selectedSearchValue.value === 'systems';
    const searchingSectors = selectedSearchValue && selectedSearchValue.value === 'sectors';
    const searchingLanes = selectedSearchValue && selectedSearchValue.value === 'lanes';

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
              { value: 'lanes', label: 'Hyperspace Lanes'}
            ]}
          />
        </div>
        <If condition={ searchingSystems }>
          <Then>
            <SearchSystems />
          </Then>
          <Else>{() => null}</Else>
        </If>
        <If condition={ searchingSectors }>
          <Then>
            <SearchSectors map={this.props.map} SearchBoundaries={this.props.searchObjectBoundaries}/>
          </Then>
          <Else>{() => null}</Else>
        </If>
        <If condition={ searchingLanes }>
          <Then>
            <SearchHyperspaceLanes map={this.props.map} SearchBoundaries={this.props.searchObjectBoundaries}/>
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