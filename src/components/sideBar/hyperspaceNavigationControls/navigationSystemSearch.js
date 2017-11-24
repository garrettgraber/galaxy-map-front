import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';


import '../../../css/main.css';

import {
  hyperspacePositionSearch,
  systemClickToggler
} from '../../../actions/actions.js';
import {
  pathStartClickToggle,
  pathEndClickToggle
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

    console.log("NavigationSystemSearch this.props: ", this.props);

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

    console.log("NavigationSystemSearch newProps: ", newProps);
    console.log("NavigationSystemSearch this.props: ", this.props);

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
  systemChange(e) {
    const searchInput = e.target.value;
    const Search = {system: searchInput, isStartPosition: this.props.isStartPosition};
    console.log("Search: ", Search.system);
    this.setState({system: Search.system});
    this.props.dispatch(hyperspacePositionSearch(Search));
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
    const clickSystemClasses = (startClickIsOn || endClickIsOn)? "btn navbar-button btn-success" : "btn navbar-button btn-primary";

    return (
      <div className="pane-column">
        <input id="start-system-input" type="text" placeholder={this.props.pointName + " System"} className="search-input" value={this.state.system} onChange={(e) => this.systemChange(e)} />

        <button
          type="button"
          className="btn navbar-button btn-primary"
          onClick={(e) => this.searchSystem(e)}
          data-tip="Search"
          data-for={'search-system-hyperspace-' + this.state.componentId}
        >
          <i className="glyphicon glyphicon-search"></i>
        </button>
        <ReactTooltip id={'search-system-hyperspace-' + this.state.componentId} place="top">{}</ReactTooltip>

        <button
          type="button"
          className={clickSystemClasses}
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
  console.log("set cursor has fired: ");
  console.log("start: ", start);
  console.log("end: ", end);
  if(!start && !end) {
    $('.leaflet-container').css('cursor','');
  } else if((start && !end) || (!start && end)) {
      $('.leaflet-container').css('cursor','crosshair');
      // $('.leaflet-container').attr("style","cursor:  url(../images/icons/sci-fi-generic/arrow-scope.svg), crosshair;");
  } else {
    console.log("Error cannot have both active");
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(NavigationSystemSearch);