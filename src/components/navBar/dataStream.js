import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';

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

    const DataStreamStyle = {
      position: 'fixed',
      top: 0,
      height: 40,
      width: 700,
      zIndex: 40,
      color: '#ff0101',
      opacity: 100,
      left: 70,
      fontSize: '1.2em',
      display: 'table'
    };

    const ZoomStyle = {
      position: 'fixed',
      top: 0,
      height: 40,
      width: 200,
      zIndex: 40,
      color: '#ff0101',
      opacity: 100,
      left: 770,
      fontSize: '1.2em',
      display: 'table'
    };

    const MessageStyle = {
      // paddingTop: 10.5,
      // paddingBottom: 10.5,
      display: "table-cell",
      verticalAlign: "middle"
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

    return (
      <div>
        <div style={DataStreamStyle}>
          <button style={ButtonStyle} className={buttonClasses} onClick={(e) => this.toggleEnglishAurebesh(e)} >Ab</button>
          <span style={MessageStyle}>
            <i>Data Stream:&nbsp;&nbsp;</i>
            {deCodedMessage}
            <span className="aurebesh-font" >{enCodedMessage}</span>
          </span>
          
        </div>
        <div style={ZoomStyle}>
          <span style={{display: "table-cell", verticalAlign: "middle"}} >Zoom:&nbsp;&nbsp;{this.props.mapCenterAndZoom.zoom - 1}</span>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(DataStream);