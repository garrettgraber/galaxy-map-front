import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';

import '../../../css/main.css';

import { setHyperspaceNavigationPoints } from '../../../actions/actions.js';
import {
  setDefaultStartPosition,
  setDefaultEndPosition,
  setDefaultStartNode,
  setDefaultEndNode,
  hyperspaceNavigationUpdateOn,
  pinPointStartOn,
  pinPointStartOff,
  pinPointEndOn,
  pinPointEndOff,
  pathStartClickOn,
  pathStartClickOff,
  pathEndClickOn,
  pathEndClickOff,
  defaultCursor,
  notAllowedCursor,
  focusSelect,
  blurSelect
} from '../../../actions/actionCreators.js';

import Place from '../../../classes/place.js';

class NavigationSystemSearch extends React.Component {
  constructor() {
    super();
    this.state = { 
      system: '',
      componentId: uuidv4(),
      searchBarWidth: 200
    };
  }

  componentDidMount() {
    const startSystem = this.props.hyperspaceStartPoint.system;
    const endSystem = this.props.hyperspaceEndPoint.system;
    const isStartPosition = this.props.isStartPosition;
    this.setSystemValue(isStartPosition, startSystem, endSystem);
    if(this.props.clickSystem) {
      this.props.dispatch(notAllowedCursor());
    }

    if(window.innerWidth < 400) {

      const windowDifference = 400 - window.innerWidth;

      const newSearchBarWidth = 200 - windowDifference - 8;

      this.setState({searchBarWidth: newSearchBarWidth});
    }
  }

  componentWillReceiveProps(newProps) {
    const startSystem = newProps.hyperspaceStartPoint.system;
    const endSystem = newProps.hyperspaceEndPoint.system;
    const isStartPosition = newProps.isStartPosition;
    this.setSystemValue(isStartPosition, startSystem, endSystem);
    if(newProps.clickSystem) {
      this.props.dispatch(notAllowedCursor());
    }


    if(window.innerWidth < 400) {

      const windowDifference = 400 - window.innerWidth;

      const newSearchBarWidth = 200 - windowDifference - 8;

      this.setState({searchBarWidth: newSearchBarWidth});
    }

  }

  setSystemValue(isStartPosition, startSystem, endSystem) {
    const isStartEmptySpace = startSystem.slice(0, 3) === 'ES@';
    const isEndEmptySpace = endSystem.slice(0, 3) === 'ES@';
    if(!isStartEmptySpace && isStartPosition) {
      this.setState({system: startSystem});
    }
    if(!isEndEmptySpace && !isStartPosition) {
      this.setState({system: endSystem});
    }
  }

  systemChange(systemValue) {
    if(systemValue === null) {
      this.setState({system: ""});
      if(this.props.isStartPosition) {
        this.props.dispatch(setDefaultStartPosition());
        this.props.dispatch(setDefaultStartNode());
      } else {
        this.props.dispatch(setDefaultEndPosition());
        this.props.dispatch(setDefaultEndNode());
      }
      this.props.dispatch(hyperspaceNavigationUpdateOn());
    } else {
      const Search = {system: systemValue.value, isStartPosition: this.props.isStartPosition};
      this.setState({system: Search.system});
      const SearchPlace = new Place({
        system: systemValue.value,
        emptySpace: false,
        isStartPosition: this.props.isStartPosition
      });
      this.props.dispatch(setHyperspaceNavigationPoints(SearchPlace));
    }
  }

  clickSystemsToggle(e) {
    this.refs.starSystemClick.blur();
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
      if(this.props.isStartPosition) {
        this.props.dispatch(pathStartClickOff());
      } else {
        this.props.dispatch(pathEndClickOff());
      }
      this.props.dispatch(defaultCursor());
    }
  }


  selectFocus(e) {
    console.log("navigation systems select focus");
    if(this.props.mobileStatus) {
      this.props.dispatch(focusSelect());
    }
  }


  selectBlur(e) {
    console.log("navigation systems select blur");
    if(this.props.mobileStatus) {
      this.props.dispatch(blurSelect());
    }
  }

  render() {
    const startClickIsOn = (this.props.isStartPosition && this.props.pathStartClick);
    const endClickIsOn = (!this.props.isStartPosition && this.props.pathEndClick);
    const clickSystemClasses = (startClickIsOn || endClickIsOn)? "btn hyperspace-navigation-button btn-success" : "btn hyperspace-navigation-button btn-primary";
    const selectOptions = [...this.props.systemNameSet];
    const filterOptions = createFilterOptions({ options: selectOptions });
    let searchBarWidth = 200;

    // if(window.innerWidth < 400) {

    //   const windowDifference = 400 - window.innerWidth;

    //   const newSearchBarWidth = 200 - windowDifference - 8;

    //   searchBarWidth = newSearchBarWidth

    //   // this.setState({searchBarWidth: newSearchBarWidth});
    // }

    return (
      <div className="pane-column">
        <div style={{display: 'inline-block', width: this.state.searchBarWidth, marginRight: 3, marginLeft: 3}}>
          <Select
            name="selected-system-search"
            filterOptions={filterOptions}
            options={selectOptions}
            style={{height: 32}}
            onChange={(selectValue) => this.systemChange(selectValue)}
            value={this.state.system}
            autoBlur={true}
            onFocus={(e) => this.selectFocus(e)}
            onBlur={(e) => this.selectBlur(e)}
          />
        </div>
        <button
          type="button"
          className={clickSystemClasses}
          style={{verticalAlign: "top"}}
          onClick={(e) => this.clickSystemsToggle(e)}
          data-tip="Click on Star System"
          data-for={'star-system-hyperspace-click' + this.state.componentId}
          ref="starSystemClick"
        >
          <i className="fa fa-sun-o"></i>
        </button>
        <ReactTooltip id={'star-system-hyperspace-click' + this.state.componentId} place="top" disable={this.props.mobileStatus}>{}</ReactTooltip>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(NavigationSystemSearch);