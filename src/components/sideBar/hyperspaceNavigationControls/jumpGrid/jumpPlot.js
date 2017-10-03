import React from 'react';
import { connect } from 'react-redux';

import '../../../../css/main.css';
import {
  calculateHyperspaceJumpOn,
} from '../../../../actions/actionCreators.js';
import {
  getHyperspacePathCollection
} from '../../../../actions/actions.js';

import AckbarIcon from '../../../../images/icons/star-wars/Ackbar.ico';
import OrbitalIcon from '../../../../images/icons/sci-fi-generic/orbital.svg';
import GalaxySpiralIcon from '../../../../images/icons/sci-fi-generic/twin-shell.svg';

class JumpPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      selected: false
    };
  }

  componentDidMount() {
    console.log("this.props.PathObject: ", this.props.PathObject);
  }

  onClick(e) {
    console.log('onClick, ', e);
    console.log("this.props.PathObject: ", this.props.PathObject);

  }

  onMouseEnter(e) {
    console.log("onMouseEnter has fired: ", e);
    this.setState({selected: true});
  }

  onMouseLeave(e) {
    console.log("onMouseLeave has fired: ", e);
    this.setState({selected: false});
  }


  render() {

    const backgroundColor = (this.state.selected)? 'rgba(50,205,50,0.25)' : 'rgba(255,0,0,0.25)';

    const JumpPlotStyle = {
      width: '100%',
      height: 50,
      backgroundColor: backgroundColor,
      border: '1px solid #49fb35',
    };

    return (
      <div style={JumpPlotStyle}
        onClick={(e) => this.onClick(e)}
        onMouseEnter={(e) => this.onMouseEnter(e)}
        onMouseLeave={(e) => this.onMouseLeave(e)}>

        <span className="nav-text" >Length:&nbsp;&nbsp;{this.props.PathObject.length}</span>
        <span className="nav-text" >&nbsp;&nbsp;Jumps:&nbsp;&nbsp;{this.props.PathObject.numberOfJumps}</span>
      </div>
    );
  }
}


// const mapStateToProps = (state = {}) => {
//     return Object.assign({}, state);
// };

// export default connect(mapStateToProps)(JumpPlot);
export default JumpPlot;
