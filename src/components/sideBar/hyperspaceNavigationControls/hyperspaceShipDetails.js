import React from 'react';
import { connect } from 'react-redux';
import distance from 'euclidean-distance';
import Geohash from 'latlon-geohash';

import '../../../css/main.css';

import AckbarIcon from '../../../images/icons/star-wars/Ackbar.ico';
import OrbitalIcon from '../../../images/icons/sci-fi-generic/orbital.svg';
import GalaxySpiralIcon from '../../../images/icons/sci-fi-generic/twin-shell.svg';

class HyperspaceShipDetails extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="pane-row-control pane-section">
        <span className="nav-text">Ship Name:&nbsp;&nbsp;Temp Ship Name </span>
      </div>
    );
  }
}


function distanceBetweenPoints(Point1, Point2) {
  const distanceBetween = distance(Point1.coordinates(), Point2.coordinates());
  const distanceBetweenNormalized = distance(Point1.coordinatesNormalized(), Point2.coordinatesNormalized());
  console.log("Point1: ", Point1.system);
  console.log("Point2: ", Point2.system);
  console.log("distanceBetween: ", distanceBetween);
  console.log("distanceBetweenNormalized: ", distanceBetweenNormalized);
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(HyperspaceShipDetails);