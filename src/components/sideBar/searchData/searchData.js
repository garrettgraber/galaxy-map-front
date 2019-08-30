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
  setSearchValueToNothing,
  focusSelect,
  blurSelect
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
    if(this.props.currentSeachValue === 'systems' || this.props.currentSeachValue === '') {
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
    if(!this.props.mobileStatus && selectedSearchValue === null) {
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
    } else if(selectedSearchValue !== null) {
      this.setState({ selectedSearchValue });
    }
  }

  selectFocus(e) {
    if(this.props.mobileStatus) {
      this.props.dispatch(focusSelect());
    }
  }

  selectBlur(e) {
    if(this.props.mobileStatus) {
      this.props.dispatch(blurSelect());
    }
  }

  render() {
    const { selectedSearchValue } = this.state;
    const searchingSystems = selectedSearchValue && selectedSearchValue.value === 'systems';
    const searchingSectors = selectedSearchValue && selectedSearchValue.value === 'sectors';
    const searchingLanes = selectedSearchValue && selectedSearchValue.value === 'lanes';
    const SearchDataStyles = {
      borderRadius: 4,
      position: 'static',
      display: 'block',
      padding: 5,
      border: '1px solid #49fb35',
      backgroundColor: 'black',
      marginBottom: 10,
      height: 50,
      width: 400,
    };
    const SearchDataStylesMobile = {
      borderRadius: 4,
      position: 'static',
      display: 'block',
      padding: 5,
      border: '1px solid #49fb35',
      backgroundColor: 'black',
      marginBottom: 10,
      height: 130,
      width: '100%',
      padding: 4
    };
    const SearchSelectStyles = {
      display: 'inline-block',
      width: 140,
      marginLeft: 5
    };
    const SearchSelectStylesMobile = {
      display: 'block',
      width: '100%',
      marginBottom: 5
    };
    const ActiveSearchDataStyles = (this.props.mobileStatus)? SearchDataStylesMobile : SearchDataStyles;
    const ActiveSearchSelectStyles = (this.props.mobileStatus)? SearchSelectStylesMobile : SearchSelectStyles

    return (
      <div id="search-data" style={ActiveSearchDataStyles}>
        <div style={ActiveSearchSelectStyles}>
          <Select
            name="search-selection-type"
            value={this.state.selectedSearchValue}
            onChange={(selectValue) => this.onChange(selectValue)}
            options={[
              { value: 'systems', label: 'Systems' },
              { value: 'sectors', label: 'Sectors' },
              { value: 'lanes', label: 'Hyperspace Lanes'}
            ]}
            autoBlur={true}
            onFocus={(e) => this.selectFocus(e)}
            onBlur={(e) => this.selectBlur(e)}
            components={{IndicatorSeparator: () => null}}
          />
        </div>
        <If condition={ searchingSystems }>
          <Then>
            <SearchSystems map={this.props.map} />
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