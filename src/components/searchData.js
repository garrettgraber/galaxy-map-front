import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { connect } from 'react-redux';
// import { displaySystems } from '../actions/mapActions.js';
import urlencode from 'urlencode';

import { findSystem } from '../actions/actions.js';

import '../css/main.css';


class SearchData extends React.Component {
  constructor() {
    super();
    this.state = { 
      inputValue: ''
    };
    this.change = (e) => {

      // console.log("e.target.value: ", e.target.value);
      // console.log("e.target.keyCode: ", e);
      this.setState({inputValue: e.target.value});

    };
  }

  componentDidMount() {

    // console.log("SearchData has Mounted: ", this.props);

  } 


  searchData() {

    // console.log("searchData has been clicked: ", this.state.inputValue);

    if(this.state.inputValue.length > 0) {

      console.log("this.props in SearchData: ", this.props);
      console.log("this.state.inputValue: ", this.state.inputValue);

      if(this.state.inputValue === this.props.currentSystem.system) {

        console.log("Same entry: ", this.props.currentSystem.system);

      } else {

            


        this.props.dispatch(findSystem(this.state.inputValue));


      }



      // this.props.dispatch({type: 'SEARCH_SYSTEMS_ON'});

      // findSystemOldSchool(this.state.inputValue, (error, data) => {

      //   console.log("error: ", error);

      //   if(error) {

      //     console.log("Bullshit back from the server!");
      //     this.props.dispatch({type: 'SEARCH_SYSTEMS_OFF'});

      //   }

      //   if(!error && data.length > 0 && (data[0]).hasLocation) {

      //     console.log("data found: ", data);

      //     const SystemObject = data[0];

      //     console.log("this.props: ", this.props.dispatch);

      //     const LngLat = SystemObject.LngLat

      //     const SystemData = {
      //       lat: LngLat[1],
      //       lng: LngLat[0],
      //       zoom: 6
      //     };


      //     this.props.dispatch({type: 'ZOOM_TO_SYSTEM', payload: SystemData});

      //       // this.props.dispatch({ type: 'SYSTEMS_ON'});
      //       // this.props.dispatch({ type: 'DISPLAY_SYSTEMS', payload: data[0] });

      //   }


      // });




    }

  }

  render() {

    const iconButtonClass = (this.props.searchSystems)? "fa fa-cog fa-spin" : "glyphicon glyphicon-search";

    return (
      <span>
        <input id="search-system-input" type="text" placeholder="Search For Systems" className="search-input" value={this.state.inputValue}  onChange={this.change}/>
        <button id="search-button-icon" type="button" className="btn btn-primary navbar-button"  onClick={(e) => this.searchData(e)} disabled={this.props.searchSystems} ><i className={iconButtonClass}></i></button>
      </span>
    );
  }
}


function findSystemOldSchool(systemName, cb) {

  $.ajax({
    url: "api/search/?system=" + urlencode(systemName),
    type: 'GET',
    success: function(data){ 
      var SystemFound = data[0];
      cb(null, data);

    },
    error: function(error) {

      cb(error, null);
    }

  });

};




const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};


// export default SearchData;

export default connect(mapStateToProps)(SearchData);
