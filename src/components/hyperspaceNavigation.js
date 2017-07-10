import React from 'react';
import { connect } from 'react-redux';
import { Pane, GeoJSON, CircleMarker, Popup, Circle, Tooltip, Marker } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import 'whatwg-fetch';
// import ReactFauxDOM from 'react-faux-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';
import StarSystemPopup from './starSystemPopup';
import HyperspaceData from 'json-loader!../data/hyperspace.geojson';
import HyperspacePathCollection from './hyperspacePathCollection.js';

console.log("HyperspaceData: ", HyperspaceData);

class HyperspaceNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PathCollection: {}
    }
  }
  componentDidMount() {
    // console.log("Hyperspace data has been found!: ", this.props);

    getStarData().then(response => {
      return response.json();
    }).then(data => {
      console.log("hyperspace route: ", data.paths.length);
      this.setState({PathCollection: data});
    }).catch(err => {
    // Error: handle it the way you like, undoing the optimistic update,
    //  showing a "out of sync" message, etc.
      console.log("err: ", err);
    });;

  }
  onEachFeature(feature, layer) {
    if(feature.properties.hyperspace) {
      layer.bindPopup(feature.properties.hyperspace)
      .on('click', function (e) {
          this.openPopup();
      })
      // .on('mouseout', function (e) {
      //     this.closePopup();
      // });
    } else {
      layer.bindPopup("Unamed Hyperspace Lane")
      .on('click', function (e) {
          this.openPopup();
      })
      // .on('mouseout', function (e) {
      //     this.closePopup();
      // })s;
    }
  }
  pointToLayer(feature, latlng) {}
  render() {
  	const hyperspaceLanesStyle = {color: '#00FFFF', weight: 3};
    const hyperspaceLanesStylePink = {color: '#FF69B4', weight: 3};
    const hyperspaceLanesStyleCarolina = {color: '#99badd ', weight: 3};
  	const zIndex = 290;
  	return (
  		<Pane name="hyperspace-navigation-pane" style={{ zIndex: zIndex }}>
  			<GeoJSON data={HyperspaceData} style={hyperspaceLanesStyleCarolina} ref='hyperspace' onEachFeature={(feature, layer) => this.onEachFeature(feature,layer)}  pointToLayer={(feature, latlng) => this.pointToLayer(feature, latlng)}/>
        <HyperspacePathCollection PathCollection={this.state.PathCollection}/>
  		</Pane>
  	)
  }
}



function getStarData() {
  const formData = {
    start:"Naboo",
    end:"Coruscant",
    maxJumps:33
  };

  // {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     name: 'Hubot',
  //     login: 'hubot',
  //   })
  // }

  return fetch('/api/hyperspace-jump/calc-shortest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start: 'Naboo',
      end: 'Coruscant',
      maxJumps: 33
    })
  });

}

        // <HyperspacePathCollection/>


// <HyperspacePathCollection>
//     <HyperspacePath>
//     <HyperspacePath />
// <HyperspacePathCollection/>

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

// export default HyperspaceNavigation;
export default connect(mapStateToProps)(HyperspaceNavigation);