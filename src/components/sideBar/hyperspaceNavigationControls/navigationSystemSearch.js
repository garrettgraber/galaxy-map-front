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
  setPositionToDefault
} from '../../../actions/actions.js';
import {
  pathStartClickToggle,
  pathEndClickToggle,
  setDefaultStartPosition,
  setDefaultEndPosition,
  hyperspaceNavigationUpdateOn,


  pinPointStartOn,
  pinPointStartOff,
  pinPointEndOn,
  pinPointEndOff,

  pathStartClickOn,
  pathStartClickOff,
  pathEndClickOn,
  pathEndClickOff

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
    this.setSystemValue(isStartPosition, startSystem, endSystem);

    setCurrsorAsNotAllowed(this.props.clickSystem);
  }
  componentWillReceiveProps(newProps) {
    const startSystem = newProps.hyperspaceStartPoint.system;
    const endSystem = newProps.hyperspaceEndPoint.system;
    const isStartPosition = newProps.isStartPosition;
    this.setSystemValue(isStartPosition, startSystem, endSystem);

    setCurrsorAsNotAllowed(newProps.clickSystem);
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

  clickSystemsToggle(e) {

    if(!this.props.clickSystem) {
      if(this.props.isStartPosition) {
        this.props.dispatch(pathEndClickOff());
        this.props.dispatch(pinPointEndOff());
        this.props.dispatch(pinPointStartOff());
        this.props.dispatch(pathStartClickOn());    
      } else {
        this.props.dispatch(pathStartClickOff());
        this.props.dispatch(pinPointStartOff());
        this.props.dispatch(pinPointEndOn());
        this.props.dispatch(pathEndClickOn());
      }
    } else {
      setCurrsorAsDefault();
      if(this.props.isStartPosition) {
        this.props.dispatch(pathStartClickOff());
      } else {
        this.props.dispatch(pathEndClickOff());
      }
    }
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
          onClick={(e) => this.clickSystemsToggle(e)}
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


function setCurrsorAsNotAllowed(systemClickIsOn) {
  if(systemClickIsOn) {
    $('.leaflet-container').css('cursor','not-allowed');
  }
}


function setCurrsorAsDefault() {
  $('.leaflet-container').css('cursor','');
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(NavigationSystemSearch);