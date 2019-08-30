import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import distance from 'euclidean-distance';
import Geohash from 'latlon-geohash';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';


import {
  noSelectedShip,
  setSelectedShip
} from '../../../actions/actionCreators.js';


import '../../../css/main.css';

import AckbarIcon from '../../../images/icons/star-wars/Ackbar.ico';
import OrbitalIcon from '../../../images/icons/sci-fi-generic/orbital.svg';
import GalaxySpiralIcon from '../../../images/icons/sci-fi-generic/twin-shell.svg';




const galacticStarShipsList = [
  {
    name: "Home One",
    speed: 10.0,
    icon: '../../images/icons/rebel-cruiser/Star-Wars-Mon-Calamari-Star-Cruiser-48x48.png'
  },
  {
    name: "Millennium Falcon",
    speed: 20.0,
    icon: '../../images/icons/falcon-icons/falcon-color-small.png'
  },
  {
    name: "Executor",
    speed: 10.0,
    icon: '../../images/icons/star-wars/Star D2.ico'
  },
];


const availableShipNames = _.map(galacticStarShipsList, (n) => {
  return {
    value: n.name,
    label: n.name
  }
});

class HyperspaceShipDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipSelectedName: undefined,
      isStartActive: true
    };
  }


  componentDidMount() {
    this.setState({
      shipSelectedName: {
        value: "",
        label: ""
      }
    });
  }

  shipChange(shipSelectedName) {

    if(shipSelectedName) {
      this.setState({
        shipSelectedName: {
          value: shipSelectedName.value,
          label: shipSelectedName.label
        }
      });
      const SelectedShipData = _.filter(galacticStarShipsList, (n, i) => n.name === shipSelectedName.value)[0];
      console.log("Ship Data: ", SelectedShipData);
      this.props.dispatch(setSelectedShip(SelectedShipData));
    } else {
      this.setState({
        shipSelectedName: {
          value: "",
          label: ""
        }
      });
      this.props.dispatch(noSelectedShip());
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


    console.log("this.props: ", this.props);

    const shipSelectedValue = (this.state.shipSelectedName)? this.state.shipSelectedName.value : false;
    const filteredSelectedOptions = _.filter(availableShipNames, (n) => n.value !==  shipSelectedValue);
    const filterOptions = createFilterOptions({ options: filteredSelectedOptions });


    return (
      <div className="pane-ship-row-control pane-section">
        <div style={{display: 'inline-block', height: 20, width: 100}}>
          <span className="nav-text">&nbsp;&nbsp;Star Ships:&nbsp;&nbsp;</span>
        </div>
        <div style={{display: 'inline-block', width: 270, marginRight: 5, heigth: 20, marginLeft: 5, paddingTop: 2, paddingBottom: 2}}>
          <Select
            name="selected-ship-search"
            filterOptions={filterOptions}
            options={filteredSelectedOptions}
            style={{height: 20}}
            onChange={(shipSelectedName) => this.shipChange(shipSelectedName)}
            value={this.state.shipSelectedName}
            isClearable={true}
            autoBlur={true}
            onFocus={(e) => this.selectFocus(e)}
            onBlur={(e) => this.selectBlur(e)}
            components={{IndicatorSeparator: () => null}}
          />
        </div>
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