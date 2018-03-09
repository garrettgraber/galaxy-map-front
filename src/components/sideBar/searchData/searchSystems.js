import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';

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
  componentDidMount() { }
  onChange(selectValue) {
    if(selectValue === null) {
      this.setState({selectValue: undefined});
      this.props.dispatch(noSystemsLocation());
      this.props.dispatch(setDefaultActiveSystem());
    } else {
      this.setState({ selectValue });
      this.props.dispatch(findSystem(selectValue.value));
    }
  }
  zoomToPoint(e) {
    if(this.state.selectValue !== null) {
      console.log("Zooming here...", this.props.activeSystem);
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
    const pointZoom = (this.state.selectValue)? 'btn hyperspace-navigation-button btn-success' : 'btn hyperspace-navigation-button btn-danger';

    return (
      <div style={{display: 'inline-block'}}>
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
        <span>
          <button type="button" className={pointZoom} style={{verticalAlign: "top", marginLeft: 10}} onClick={(e) => this.zoomToPoint(e)}   data-tip={tooltipZoomText}  data-for={'go-to-system-from-search' + this.state.componentId}>
            <i className={"fa fa-bullseye"} ></i>
          </button>
          <ReactTooltip id={'go-to-system-from-search' + this.state.componentId} place="right">{}</ReactTooltip>
        </span>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchSystems);