import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
import { If, Then, Else } from 'react-if';

// import * as SearchStyles from './searchStyles.js';

import { getSearchStyles } from './searchStyles.js';

import {
  zoomToSector
} from '../../../actions/actions.js';
import {
  noSectorData,
  addItemToDataStream,
  focusSelect,
  blurSelect
} from '../../../actions/actionCreators.js';
import '../../../css/main.css';

class SearchSectors extends React.Component {
  constructor() {
    super();
    this.state = {
      sectorValue: undefined,
      componentId: uuidv4()
    };
  }

  componentDidMount() {
    if(this.props.sectorSearchData.name !== null) {
      const sectorSearchArray =  [...this.props.sectorSearchSet];
      const sectorValue = sectorSearchArray.find(e => e.label === this.props.sectorSearchData.name);
      this.setState({ sectorValue });
    }
  }

  onChange(sectorValue) {  
    if(sectorValue === null) {
      this.setState({sectorValue: undefined});
      this.props.dispatch(noSectorData());
    } else {
      this.setState({ sectorValue });
      this.props.dispatch(zoomToSector(sectorValue, 6));
      this.refs.zoomToButton.focus();
    }
  }

  zoomToPoint(e) {
    this.refs.zoomToButton.blur();
    if(this.state.sectorValue) {
      const dataStreamMessage = "Zoomed to " + this.state.sectorValue.label + ' Sector ...';
      const map = this.props.map;
      map.fitBounds(this.props.SearchBoundaries);
      this.props.dispatch(addItemToDataStream(dataStreamMessage));
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
    let sectorSearchArray =  [...this.props.sectorSearchSet];
    sectorSearchArray.sort(function(a, b){
      const sectorA = a.label.toLowerCase();
      const sectorB = b.label.toLowerCase();
      if(sectorA < sectorB) return -1;
      if(sectorA > sectorB) return 1;
      return 0;
    });
    const filterSectorOptions = createFilterOptions({ options: sectorSearchArray });
    const tooltipZoomText = (this.state.sectorValue)? 'Zoom to the ' + this.state.sectorValue.label + ' Sector' : 'No Sector selected';
    const pointZoom = (this.state.sectorValue)? 'btn btn-success' : 'btn btn-danger';
    const Styles = getSearchStyles(this.props.mobileStatus);
    const selectedSector = (this.state.sectorValue)? this.state.sectorValue.label : null;
    const sectorHasSectorInName = (selectedSector && selectedSector.toLowerCase().indexOf('sector') > -1)? true : false;
    const sectorDisplayName = (sectorHasSectorInName)? selectedSector : selectedSector + ' Sector';

    return (
      <div style={Styles.SearchContainer}>
        <div style={Styles.SearchSelect}>
          <Select
            name="selected-sector-search"
            filterOptions={filterSectorOptions}
            options={sectorSearchArray}
            onChange={(sectorValue) => this.onChange(sectorValue)}
            value={this.state.sectorValue}
            placeholder="Go To Sector..."
            autoBlur={true}
            onFocus={(e) => this.selectFocus(e)}
            onBlur={(e) => this.selectBlur(e)}
          />
        </div>
        <span>
          <button type="button" className={pointZoom} style={Styles.SearchButton} onClick={(e) => this.zoomToPoint(e)}   data-tip={tooltipZoomText}  data-for={'go-to-sector-from-search' + this.state.componentId} ref="zoomToButton">
            <If condition={ this.props.mobileStatus && selectedSector !== null}>
              <Then>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;Zoom to the {sectorDisplayName}&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </Then>
              <Else><i className={"fa fa-bullseye"} ></i></Else>
            </If>
          </button>
          <ReactTooltip id={'go-to-sector-from-search' + this.state.componentId} place="right" disable={this.props.mobileStatus}>{}</ReactTooltip>
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(SearchSectors);