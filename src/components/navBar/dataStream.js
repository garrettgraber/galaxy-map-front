import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';
import Geohash from 'latlon-geohash';
import Clock from 'react-live-clock';


import '../../css/main.css';

class DataStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deCodedIndex: 0,
      dataMessage: '',
      dataMessageInEnglish: true
    };
  }

  deCodeLetter() {
    let newCodedIndex = this.state.deCodedIndex + 1;
    if(newCodedIndex < 0) {
      this.setState({ deCodedIndex: 0 });
      this.setState({ dataMessageInEnglish: true });
      clearInterval(this.intervalId);
    } else if(newCodedIndex >= this.props.dataMessage.length) { 
      this.setState({ deCodedIndex: this.props.dataMessage.length });
      this.setState({ dataMessageInEnglish: false });
      clearInterval(this.intervalId);
    } else {
      this.setState({ deCodedIndex: newCodedIndex });
    }
  }

  componentDidMount() {
    console.log("DataStream has Mounted");
    this.setState({dataMessage: this.props.dataMessage});
    this.intervalId = setInterval(this.deCodeLetter.bind(this), 500);
  }

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.dataMessage !== this.state.dataMessage) {
      clearInterval(this.intervalId);
      this.state.deCodedIndex = 0;
      this.setState({dataMessage: newProps.dataMessage});
      this.intervalId = setInterval(this.deCodeLetter.bind(this), 500);
    }
  }

  toggleEnglishAurebesh(e) {
    if(this.state.deCodedIndex !== 0 && this.state.deCodedIndex !== this.props.dataMessage.length) {
      console.log("Message decrypting...");
    } else {
      console.log("Translating message");
      let newDeCodedIndex = this.state.deCodedIndex;
      if(this.state.dataMessageInEnglish) {
        newDeCodedIndex = this.props.dataMessage.length;
        this.setState({deCodedIndex : newDeCodedIndex});
      } else {
        newDeCodedIndex = 0;
        this.setState({deCodedIndex: newDeCodedIndex});
      }
      const dataMessageInEnglish = (this.state.dataMessageInEnglish)? false : true;
      this.setState({dataMessageInEnglish: dataMessageInEnglish});
    }
  }

  
	render() {

    const ClockStyle = {
      position: 'fixed',
      top: 0,
      height: 40,
      width: 70,
      zIndex: 40,
      color: '#ff0101',
      backgroundColor: 'rgba(255,255,255,.5)',
      opacity: 1.0,
      left: 0,
      fontSize: '1.2em',
      display: 'table'
    };

    const DataStreamStyle = {
      position: 'fixed',
      top: 0,
      height: 40,
      width: 600,
      zIndex: 40,
      color: '#ff0101',
      // color: '#FF0066',
      backgroundColor: 'rgba(255,255,255,.5)',
      // backgroundColor: 'white',
      opacity: 1.0,
      left: 70,
      fontSize: '1.2em',
      display: 'table',
      // textShadow: '#FF0066 0 0 10px'

      // webkitfilter: blur(2px),
      // filter: blur(2px)
    };

    const ZoomStyle = {
      position: 'fixed',
      top: 0,
      height: 40,
      width: 80,
      zIndex: 40,
      color: '#ff0101',
      backgroundColor: 'rgba(255,255,255,.5)',
      opacity: 1.0,
      left: 670,
      fontSize: '1.2em',
      display: 'table'
    };

    const MapBoundsStyle = {
      position: 'fixed',
      top: 0,
      height: 40,
      width: 200,
      zIndex: 40,
      color: '#ff0101',
      backgroundColor: 'rgba(255,255,255,.5)',
      opacity: 1.0,
      left: 750,
      fontSize: '1.2em',
      display: 'table'
    };

    const MessageStyle = {
      // paddingTop: 10.5,
      // paddingBottom: 10.5,
      display: "table-cell",
      verticalAlign: "middle",
      opacity: 1.0
    };

    const ButtonStyle = {
      marginBottom: 5,
      marginTop: 5
      // display: "table-cell",
      // verticalAlign: "middle"
      // paddingBottom: 5,
      // paddingTop: 5
    };

    let buttonClasses = "btn btn-sm btn-danger ";
    const buttonClassesFont = (this.state.dataMessageInEnglish)? "" : "aurebesh-font";
    buttonClasses += buttonClassesFont;
    const currentMessage = this.props.dataMessage;
    const deCodedIndex = this.state.deCodedIndex;
    const deCodedMessage = currentMessage.slice(0, deCodedIndex);
    const enCodedMessage = currentMessage.slice(deCodedIndex, currentMessage.length);
    const northEastMapHash = this.props.northEastMapHash;
    const southWestMapHash = this.props.southWestMapHash;
    const northEastPoint = (northEastMapHash)? Geohash.decode(northEastMapHash) : null;
    const southWestPoint = (southWestMapHash)? Geohash.decode(southWestMapHash) : null;
    const northEastPointLat = (northEastPoint)? (northEastPoint.lat).toFixed(2) : '';
    const northEastPointLng = (northEastPoint)? (northEastPoint.lon).toFixed(2) : '';
    const southWestPointLat = (southWestPoint)? (southWestPoint.lat).toFixed(2) : '';
    const southWestPointLng = (southWestPoint)? (southWestPoint.lon).toFixed(2) : '';

    console.log("northEastPoint: ", northEastPoint);
    console.log("southWestPoint: ", southWestPoint);

    return (
      <div id="data-stream" >
        <div style={ClockStyle}>
          <span style={MessageStyle}>&nbsp;<Clock format={'HH : mm'} ticking={true}/></span>
        </div>
        <div style={DataStreamStyle} >
          <button style={ButtonStyle} className={buttonClasses} onClick={(e) => this.toggleEnglishAurebesh(e)}>Ab</button>
          <span style={MessageStyle}>
            <i>Data Stream:&nbsp;</i>
            {deCodedMessage}
            <span className="aurebesh-font" >{enCodedMessage}</span>
          </span>
        </div>
        <div style={ZoomStyle}>
          <span style={MessageStyle} >Zoom:&nbsp;{this.props.mapCenterAndZoom.zoom - 1}</span>
        </div>
        <div style={MapBoundsStyle}>
          <span style={MessageStyle} >
            SW:&nbsp;Lat&nbsp;{southWestPointLat}&nbsp;Lng&nbsp;{southWestPointLng}
          </span>
          <span style={MessageStyle} >
            &nbsp;&nbsp;NE:&nbsp;Lat&nbsp;{northEastPointLat}&nbsp;Lng&nbsp;{northEastPointLng}
          </span>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(DataStream);