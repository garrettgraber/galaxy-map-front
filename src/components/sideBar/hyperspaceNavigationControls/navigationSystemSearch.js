import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
import VirtualizedSelect from 'react-virtualized-select';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';


import '../../../css/main.css';

import {
  hyperspacePositionSearch,
  systemClickToggler,
  setPositionToDefault
} from '../../../actions/actions.js';
import {
  pathStartClickToggle,
  pathEndClickToggle,
  setDefaultStartPosition,
  setDefaultEndPosition,
  hyperspaceNavigationUpdateOn
} from '../../../actions/actionCreators.js';

class NavigationSystemSearch extends React.Component {
  constructor() {
    super();
    this.state = { 
      system: '',
      componentId: uuidv4(),

    };
  }
  componentDidMount() {
    const startSystem = this.props.hyperspaceStartPoint.system;
    const endSystem = this.props.hyperspaceEndPoint.system;
    const isStartPosition = this.props.isStartPosition;
    const pathStartClick = this.props.pathStartClick;
    const pathEndClick = this.props.pathEndClick;
    this.setSystemValue(isStartPosition, startSystem, endSystem);
    const startClickIsOn = (isStartPosition && pathStartClick);
    const endClickIsOn = (!isStartPosition && pathEndClick);
    setCurrsor(startClickIsOn, endClickIsOn);
  }
  componentWillReceiveProps(newProps) {
    const startSystem = newProps.hyperspaceStartPoint.system;
    const endSystem = newProps.hyperspaceEndPoint.system;
    const isStartPosition = newProps.isStartPosition;
    const pathStartClick = newProps.pathStartClick;
    const pathEndClick = newProps.pathEndClick;
    this.setSystemValue(isStartPosition, startSystem, endSystem);
    const startClickIsOn = ( isStartPosition && pathStartClick);
    const endClickIsOn = (!isStartPosition && pathEndClick);

    setCurrsor(pathStartClick, pathEndClick);
  }
  setSystemValue(isStartPosition, startSystem, endSystem) {
    const isStartEmptySpace = startSystem.slice(0, 3) === 'ES@';
    const isEndEmptySpace = endSystem.slice(0, 3) === 'ES@';

    if(startSystem && !isStartEmptySpace && isStartPosition) {
      this.setState({system: startSystem});
    }
    if(endSystem && !isEndEmptySpace && !isStartPosition) {
      this.setState({system: endSystem});
    }
  }
  systemChange(systemValue) {
    if(systemValue === null) {
      this.setState({system: ""});

      console.log("Coordinate emptied: ", systemValue);

      if(this.props.isStartPosition) {
        this.props.dispatch(setDefaultStartPosition());
      } else {
        this.props.dispatch(setDefaultEndPosition());
      }

      this.props.dispatch(hyperspaceNavigationUpdateOn());

    } else {
      const Search = {system: systemValue.value, isStartPosition: this.props.isStartPosition};
      this.setState({system: Search.system});
      this.props.dispatch(hyperspacePositionSearch(Search));
    }
  }
  searchSystem(e) {
    const Search = {system: this.state.system, isStartPosition: this.props.isStartPosition};
    this.props.dispatch(hyperspacePositionSearch(Search));
  }
  clickSystem(e) {
    this.props.dispatch(systemClickToggler(this.props.isStartPosition));
  }
  render() {
    const startClickIsOn = (this.props.isStartPosition && this.props.pathStartClick);
    const endClickIsOn = (!this.props.isStartPosition && this.props.pathEndClick);
    const clickSystemClasses = (startClickIsOn || endClickIsOn)? "btn hyperspace-navigation-button btn-success" : "btn hyperspace-navigation-button btn-primary";
    const selectOptions = [...this.props.systemNameSet];
    const filterOptions = createFilterOptions({ options: selectOptions });

    return (
      <div className="pane-column">

        <div style={{display: 'inline-block', width: 200, marginRight: 3, marginLeft: 3}}>
          <Select
            name="selected-system-search"
            filterOptions={filterOptions}
            options={selectOptions}
            style={{height: 32}}
            onChange={(selectValue) => this.systemChange(selectValue)}
            value={this.state.system}
          />
        </div>

        <button
          type="button"
          className={clickSystemClasses}
          style={{verticalAlign: "top"}}
          onClick={(e) => this.clickSystem(e)}
          data-tip="Click on Star System"
          data-for={'star-system-hyperspace-click' + this.state.componentId}
        >
          <i className="fa fa-sun-o"></i>
        </button>
        <ReactTooltip id={'star-system-hyperspace-click' + this.state.componentId} place="top">{}</ReactTooltip>

      </div>
    );
  }
}

function setCurrsor(start, end) {
  if(!start && !end) {
    $('.leaflet-container').css('cursor','');
  } else if((start && !end) || (!start && end)) {
      $('.leaflet-container').css('cursor','not-allowed');
  } else {
    console.log("Error cannot have both active");
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(NavigationSystemSearch);