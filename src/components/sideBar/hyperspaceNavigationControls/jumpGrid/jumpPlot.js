import React from 'react';
import { connect } from 'react-redux';
import '../../../../css/main.css';
import {
  nullActiveHyperspaceJump,
  activeHyperspaceJump
} from '../../../../actions/actionCreators.js';
import {
  setSelectedHyperspaceRoute
} from '../../../../actions/actions.js';

class JumpPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      selected: false,
      currentlyActive: false
    };
  }

  componentDidMount() {
    if(this.props.singleJump) {
      this.setState({singleJump: true});
      this.setState({currentlyActive: true});
    } else {
      this.setState({singleJump: false});
    }
  }

  onClick(e) {
    if(!this.props.singleJump) {
      const selectedAndNoActiveJump = this.state.selected && this.props.activeHyperspaceJump === null;
      const jumpIsActive = this.props.activeHyperspaceJump === this.props.PathObject.hashValue;
      if(!jumpIsActive) {
        this.setState({currentlyActive: true});
        this.props.dispatch(activeHyperspaceJump(this.props.PathObject.hashValue));
      } else if(jumpIsActive) {
        this.setState({currentlyActive: false});
        this.props.dispatch(nullActiveHyperspaceJump());
      } else {

      }
    }
  }

  onMouseEnter(e) {
    if(!this.props.singleJump && this.props.PathObject.hashValue !== this.props.hyperspaceHash) {
      this.setState({selected: true});
      this.props.dispatch(setSelectedHyperspaceRoute(this.props.PathObject.hashValue));
    }
  }
  onMouseLeave(e) {
    if(!this.props.singleJump) {
      this.setState({selected: false});
    }
  }

  onMouseOver(e) {
    if(!this.props.singleJump && this.props.PathObject.hashValue !== this.props.hyperspaceHash) {
      this.setState({selected: true});
      this.props.dispatch(setSelectedHyperspaceRoute(this.props.PathObject.hashValue));
    }
  }

  onMouseOut(e) {
    console.log("mouse out jump plot");
    if(!this.props.singleJump) {
      this.setState({selected: false});
    }
  }

  componentWillReceiveProps(newProps) {
    if(!this.props.singleJump && this.state.currentlyActive && this.props.PathObject.hashValue !== newProps.activeHyperspaceJump) {
      this.setState({currentlyActive: false});
    }
  }

  render() {
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

    const jumpDistance = parseFloat(this.props.PathObject.length.toFixed(2));

    return (
      <div style={JumpPlotStyle}
        onClick={(e) => this.onClick(e)}
        onMouseEnter={(e) => this.onMouseEnter(e)}
        onMouseOver={(e) => this.onMouseOver(e)}
        onMouseLeave={(e) => this.onMouseLeave(e)} >

        <div style={{width: '100%'}} >
          <span className="nav-text" >&nbsp;Distance:&nbsp;{jumpDistance.toLocaleString()}&nbsp;parsecs</span>
          <span className="nav-text" >&nbsp;&nbsp;Jumps:&nbsp;{this.props.PathObject.numberOfJumps}</span><br/>
          <span className="nav-text" >&nbsp;Distance out of Lane:&nbsp;{this.props.freeSpaceDistance.toLocaleString()}&nbsp;parsecs</span>
        </div>
      </div>
    );
  }
}

function emptySpaceCheck(system) {
  if(system.includes('@')) {
    const splitSystem = system.split('@');
    const emptySpaceHash = splitSystem[1];
    const emptySpaceName = "ES " + emptySpaceHash.slice(0, 10);
    return emptySpaceName;
  } else {
    return system;
  }
}

const mapStateToProps = (state = {}) => {
    return Object.assign({}, state);
};

export default connect(mapStateToProps)(JumpPlot);