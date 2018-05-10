import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
import { If, Then, Else } from 'react-if';

import * as SearchStyles from './searchStyles.js';

import { findSystem } from '../../../actions/actions.js';
import {
  noSystemsLocation,
  setDefaultActiveSystem,
  setMapCenterAndZoom,
  addItemToDataStream
} from '../../../actions/actionCreators.js';

import '../../../css/main.css';

class SearchSystems extends React.Component {
  constructor() {
    super();
    this.state = {
      selectValue: undefined,
      componentId: uuidv4()
    };
  }
  componentDidMount() {
    if(this.props.activeSystem.system !== "") {
      this.setState({
        selectValue: {
          value: this.props.activeSystem.system,
          label: this.props.activeSystem.system
        }
      });
    }
  }
  onChange(selectValue) {
    if(selectValue === null) {
      this.setState({selectValue: undefined});
      this.props.dispatch(noSystemsLocation());
      this.props.dispatch(setDefaultActiveSystem());
    } else {
      this.setState({ selectValue });
      this.props.dispatch(findSystem(selectValue.value));
      this.refs.zoomToSystem.focus();
    }
  }
  zoomToPoint(e) {
    if(this.state.selectValue !== null) {
      this.refs.zoomToSystem.blur();
      const lat = this.props.activeSystem.lat;
      const lng = this.props.activeSystem.lng;
      const systemCenter = [lat, lng];
      const newZoom = 6;
      const dataStreamMessage = "Zoomed to " + this.props.activeSystem.system + ' ...';
      this.props.dispatch( addItemToDataStream(dataStreamMessage) );
      this.props.dispatch(setMapCenterAndZoom(systemCenter, newZoom));
    }
  }
  render() {
    const selectOptions = [...this.props.systemNameSet];
    const filterOptions = createFilterOptions({ options: selectOptions });
    const tooltipZoomText = (this.state.selectValue)? 'Zoom to ' + this.state.selectValue.value : 'No System selected';
    const pointZoom = (this.state.selectValue)? 'btn btn-success' : 'btn btn-danger';

    const newButtonZoom = (this.state.selectValue)? 'success' : 'danger';

    const SearchSystemsStyles = {
      display: 'inline-block'
    };

    const SearchSystemsStylesMobile = {
      display: 'block',
      width: '100%'
    };

    const SearchSystemsSelectStyles = {
      display: 'inline-block',
      width: 180,
      marginLeft: 10
    };

    const SearchSystemsSelectStylesMobile = {
      display: 'block',
      width: '100%',
      marginBottom: 5
    };

    const SearchButtonStyles = {
      height: 36,
      marginRight: 3,
      marginLeft: 3,
      verticalAlign: "top",
      marginLeft: 10
    };

    const SearchButtonStylesMobile = {
      width: '100%',
      height: 36,
    };

    const ActiveSearchSystemsStyles = (this.props.mobileStatus)? SearchStyles.SearchSystemsStylesMobile : SearchStyles.SearchSystemsStyles;
    const ActiveSearchSystemsSelectStyles = (this.props.mobileStatus)? SearchStyles.SearchSystemsSelectStylesMobile : SearchStyles.SearchSystemsSelectStyles;
    const ActiveSearchButtonStyles = (this.props.mobileStatus)? SearchStyles.SearchButtonStylesMobile : SearchStyles.SearchButtonStyles;
    const jumpStatusLabel = (this.state.selectValue)? this.state.selectValue.label : null;

    return (
      <div style={ActiveSearchSystemsStyles}>
        <div style={ActiveSearchSystemsSelectStyles}>
          <Select
            name="selected-system-search"
            filterOptions={filterOptions}
            options={selectOptions}
            onChange={(selectValue) => this.onChange(selectValue)}
            value={this.state.selectValue}
            placeholder="Go To System..."
          />
        </div>
        <span>
          <button type="button" className={pointZoom} style={ActiveSearchButtonStyles} onClick={(e) => this.zoomToPoint(e)}   data-tip={tooltipZoomText}  data-for={'go-to-system-from-search' + this.state.componentId} ref="zoomToSystem">
            <If condition={ this.props.mobileStatus && jumpStatusLabel !== null}>
              <Then>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;Zoom to {jumpStatusLabel}&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </Then>
              <Else><i className={"fa fa-bullseye"} ></i></Else>
            </If>
          </button>
            <If condition={ this.props.mobileStatus }>
              <Then>{() => null}</Then>
              <Else>
                <ReactTooltip id={'go-to-system-from-search' + this.state.componentId} place="right">{}</ReactTooltip>
              </Else>
            </If>
        </span>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchSystems);