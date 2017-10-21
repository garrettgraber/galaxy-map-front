import React from 'react';
import { connect } from 'react-redux';

import '../../../css/main.css';

import {
  hyperspacePositionSearch,
} from '../../../actions/actions.js';

class NavigationSystemSearch extends React.Component {
  constructor() {
    super();
    this.state = { 
      system: '',
    };
  }
  componentDidMount() {


    const startSystem = this.props.hyperspaceStartPoint.system;
    const endSystem = this.props.hyperspaceEndPoint.system;

    const isStartEmptySpace = startSystem.slice(0, 3) === 'ES@';
    const isEndEmptySpace = endSystem.slice(0, 3) === 'ES@';

    if(startSystem && !isStartEmptySpace && this.props.isStartPosition) {
      this.setState({system: startSystem});
    }

    if(endSystem && !isEndEmptySpace && !this.props.isStartPosition) {
      this.setState({system: endSystem});
    }

    // this.setState({system: this.props.system});
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
  render() {
    return (
      <div className="pane-column">
        <input id="start-system-input" type="text" placeholder={this.props.pointName + " System"} className="search-input" value={this.state.system} onChange={(e) => this.systemChange(e)} />
        <button type="button" className="btn navbar-button btn-primary"  onClick={(e) => this.searchSystem(e)} ><i className="glyphicon glyphicon-search"></i></button>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(NavigationSystemSearch);