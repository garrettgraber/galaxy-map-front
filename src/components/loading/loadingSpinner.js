import React from 'react';
import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';


import LoadingGif from '../../images/gifs/ajax-loader.gif';
import LoadingGifBig from '../../images/gifs/ajax-loader-big.gif';


import '../../css/main.css';


class LoadingSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  componentWillUnmount(){
  }

  componentWillReceiveProps(newProps) {

  }


  
	render() {

    const spinnerYPosition = (window.innerHeight / 2.0) - 15.0; 
    const spinnerXPosition = (window.innerWidth / 2.0) - 15.0;

    return (

      <If condition={this.props.loadingIconOn}>
        <Then>
          <div id="loading-spinner" style={{position: 'fixed', left: spinnerXPosition, top: spinnerYPosition, zIndex: 50}}>
            <img  id="" style={{width: 30, height: 30}} src={LoadingGifBig} />
          </div>
        </Then>
        <Else>{() => null }</Else>
      </If>
    );
  }
}


const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

export default connect(mapStateToProps)(LoadingSpinner);