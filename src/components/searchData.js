import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { connect } from 'react-redux';
// import { displaySystems } from '../actions/mapActions.js';
import urlencode from 'urlencode';

import '../css/main.css';


class SearchData extends React.Component {
  constructor() {
    super();
    this.state = { inputValue: '' };
    this.change = (e) => {

      // console.log("e.target.value: ", e.target.value);
      // console.log("e.target.keyCode: ", e);
      this.setState({inputValue: e.target.value});

    };
  }

  componentDidMount() {

    console.log("SearchData has Mounted: ", this.props);

  } 


  searchData() {

    console.log("searchData has been clicked: ", this.state.inputValue);

    if(this.state.inputValue.length > 0) {


      findSystem(this.state.inputValue, (error, data) => {

        console.log("data found: ", data);

        const SystemObject = data[0];

        if(data.length > 0 && SystemObject.hasLocation) {

          console.log("this.props: ", this.props.dispatch);

          const LngLat = SystemObject.LngLat

          const SystemData = {
            lat: LngLat[1],
            lng: LngLat[0],
            zoom: 6
          };


          this.props.dispatch({type: 'ZOOM_TO_SYSTEM', payload: SystemData});

            // this.props.dispatch({ type: 'SYSTEMS_ON'});
            // this.props.dispatch({ type: 'DISPLAY_SYSTEMS', payload: data[0] });

        }


      });

    }

  }

  render() {

    return (
      <span>
        <input id="search-system-input" type="text" placeholder="Search For Systems" className="search-input" value={this.state.inputValue}  onChange={this.change}/>
        <button id="search-button-icon" type="button" className="btn btn-primary glyphicon glyphicon-search navbar-button"  onClick={(e) => this.searchData(e)} ></button>
      </span>
    );
  }
}


// <button id="search-system" type="button" className="btn btn-primary navbar-button" style={  {marginRight: 10} }  onClick={(e) => this.searchData(e)}>Planet Search&nbsp;&nbsp;</button>


function findSystem(systemName, cb) {

  $.get("api/search/?system=" + urlencode(systemName), function(data) {

    var SystemFound = data[0];

    cb(null, data);

  });

};




const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default SearchData;

export default connect(mapStateToProps)(SearchData);
