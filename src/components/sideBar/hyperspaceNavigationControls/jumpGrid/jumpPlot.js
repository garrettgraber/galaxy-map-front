import React from 'react';
import { connect } from 'react-redux';

import '../../../../css/main.css';
import {
  calculateHyperspaceJumpOn,
  nullActiveHyperspaceJump,
  activeHyperspaceJump
} from '../../../../actions/actionCreators.js';
import {
  setSelectedHyperspaceRoute
} from '../../../../actions/actions.js';

import AckbarIcon from '../../../../images/icons/star-wars/Ackbar.ico';
import OrbitalIcon from '../../../../images/icons/sci-fi-generic/orbital.svg';
import GalaxySpiralIcon from '../../../../images/icons/sci-fi-generic/twin-shell.svg';

class JumpPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      selected: false,
      currentlyActive: false
    };
  }

  componentDidMount() {
    console.log("this.props.PathObject: ", this.props.PathObject);
  }

  onClick(e) {
    // console.log('onClick, ', e);
    const selectedAndNoActiveJump = this.state.selected && this.props.activeHyperspaceJump === null;
    const jumpIsActive = this.props.activeHyperspaceJump === this.props.PathObject.hashValue;

    console.log('selectedAndNoActiveJump: ', selectedAndNoActiveJump);
    console.log('jumpIsActive: ', jumpIsActive);

    if(!jumpIsActive) {
      this.setState({currentlyActive: true});
      this.props.dispatch(activeHyperspaceJump(this.props.PathObject.hashValue));
    } else if(jumpIsActive) {
      this.setState({currentlyActive: false});
      this.props.dispatch(nullActiveHyperspaceJump());
    } else {
      console.log("Miss click bitch!");
    }
  }

  onMouseEnter(e) {
    console.log("onMouseEnter has fired: ", e);
    if(this.props.PathObject.hashValue !== this.props.hyperspaceHash) {

      this.setState({selected: true});
      this.props.dispatch(setSelectedHyperspaceRoute(this.props.PathObject.hashValue));

    }

  }

  onMouseLeave(e) {
    console.log("onMouseLeave has fired: ", e);
    this.setState({selected: false});
  }

  onMouseOver(e) {
    console.log("onMouseOver has fired: ", e);

    if(this.props.PathObject.hashValue !== this.props.hyperspaceHash) {

      this.setState({selected: true});
      this.props.dispatch(setSelectedHyperspaceRoute(this.props.PathObject.hashValue));

    }

  }

  onMouseOut(e) {
    console.log("onMouseOut has fired: ", e);
    this.setState({selected: false});
  }

    componentWillReceiveProps(newProps) {

      console.log("Jump component receiving props: ", newProps);
      if(this.state.currentlyActive && this.props.PathObject.hashValue !== newProps.activeHyperspaceJump) {
        this.setState({currentlyActive: false});
      }

    }

  render() {


    // let backgroundColor = (this.state.selected)? 'rgba(50,205,50,0.25)' : 'rgba(255,0,0,0.25)';


    let backgroundColor = 'rgba(255,0,0,0.25)';



    if(this.state.currentlyActive) {

      backgroundColor = 'rgba(50,205,50,0.25)';

    } else if(this.state.selected && !this.state.currentlyActive && this.props.PathObject.hashValue !== this.props.activeHyperspaceJump) {
      backgroundColor = 'rgba(255, 215, 0, 0.25)';
    }




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

        onMouseOver={(e) => this.onMouseOver(e)}
        onMouseLeave={(e) => this.onMouseLeave(e)} >

        <span className="nav-text" >Length:&nbsp;{this.props.PathObject.length.toFixed(2)}</span>
        <span className="nav-text" >&nbsp;&nbsp;Jumps:&nbsp;{this.props.PathObject.numberOfJumps}</span>
      </div>
    );
  }
}


const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(JumpPlot);
// export default JumpPlot;
