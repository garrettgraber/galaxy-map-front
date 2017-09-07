import React from 'react';
import '../../css/main.css';

class LatLngDisplay extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {


  } 

  render() {
    const lat = (this.props.lat || this.props.lat === 0)? this.props.lat.toFixed(4) : '';
    const lng = (this.props.lng || this.props.lng === 0)? this.props.lng.toFixed(4) : '';
    return (
      <span>
        <span className="nav-text">&nbsp;&nbsp;Lat:&nbsp;&nbsp;{lat}</span>
        <span className="nav-text">&nbsp;&nbsp;Lng:&nbsp;&nbsp;{lng}</span>
      </span>
    )
  }
}

export default LatLngDisplay;
