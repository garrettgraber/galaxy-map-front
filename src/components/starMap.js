import React from 'react';
import { connect } from 'react-redux';
import { Pane, FeatureGroup, Circle } from 'react-leaflet';
import L from 'leaflet';
import width from 'text-width';
import _ from 'lodash';
import { Planet, HyperSpaceLane } from '../classes/stellarClasses.js';
import StarSystem from './starSystem.js';
import { 
  searchSystemsFinish,
  getZoomValue,
  setZoomValue,
  renderMapOn,
  renderMapOff,
  renderMapStatus,
  zoomChangeStatus,
  zoomChangeOff
} from '../actions/actionCreators.js';
import 'leaflet/dist/leaflet.css';
import 'leaflet_marker';
import 'leaflet_marker_2x';
import 'leaflet_marker_shadow';

const MapBoundariesMax = {
  latitude: {
    north: 84.0,
    south: -84.0
  },
  longitude: {
    east: 170.0,
    west: -170.0
  }
};

class StarMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	starData: [],
      starsInView: [],
      StarMapComponents: [],
    	starDataLoaded: false,
      GalacticPlanetsArray: [],
      GalacticPlanetsSet: new Set(),
      previousIntersectionMap: new Set(),
      PlanetarySystemArray: [],
      zoom: 2
    };
  }

  componentDidMount() {
  	const that = this;
  	fetch('/api/has-location')  
		.then(function(response) {
	    	return response.json();
		}).then(function(data) {
      const StarData = JSON.parse(data);
      const PlanetsArray = [];

  		for(let i=0; i < StarData.length; i++) {

        let textWidth = width(StarData[i].system, {
            size: "1em"
        });
        textWidth +=  0.5;
        const currentStar = StarData[i];
        delete currentStar.__v;
        const CurrentSystem = new Planet(
          currentStar.system,
          currentStar.sector,
          currentStar.region,
          currentStar.coordinates,
          currentStar.xGalactic,
          currentStar.yGalactic,
          currentStar.xGalacticLong,
          currentStar.yGalacticLong,
          currentStar.hasLocation,
          currentStar.LngLat,
          currentStar.lat,
          currentStar.lng,
          currentStar.zoom,
          currentStar.link,
          textWidth
        );
        PlanetsArray.push(CurrentSystem);
  		}
      const galacticPlanetsSet = new Set(PlanetsArray);
      console.log("Galactic Planets Set: ", galacticPlanetsSet);
  		that.setState({starData: StarData}); 
      that.setState({GalacticPlanetsArray: PlanetsArray});
      that.setState({GalacticPlanetsSet: galacticPlanetsSet});
      const StarMapComponents = that.createStarMap();
      that.setState({StarMapComponents: StarMapComponents});
  		that.setState({starDataLoaded: true});
  	});
  }

  componentWillReceiveProps(newProps) {
    // console.log("Props update StarMap: ", newProps);
    // this.setState({zoomLevel: currentZoom});
    console.log("\nZoom in StarMap: ", this.props.zoom);
    const currentZoom = this.props.map.getZoom();
    console.log("currentZoom: ", newProps.zoom);
    if(this.props.zoom !== this.state.zoom) {
      console.log("Zoom change: ", this.props.zoom);
    }
    this.setState({zoom: this.props.zoom});
  }

  createStarMap() {
    console.log("\n\n\n****StarMap creation!****");
    const currentZoom = this.props.zoom;
    const currentMap = this.props.map;
    console.log("+++++Zoom at Star Creation: ", currentZoom);
    console.log("Map zoom: ", currentMap.getZoom());
    const zoomLevelBasedRendering = true;
    const starSystemArray = [];
    let stellarComponentsArray = [];
    const CurrentMapBoundaries = currentMap.getBounds();
    const mapWidth = CurrentMapBoundaries._northEast.lng - CurrentMapBoundaries._southWest.lng;
    const mapHeight = CurrentMapBoundaries._northEast.lat - CurrentMapBoundaries._southWest.lat;
    let InViewSystems = 0;
    let mapPaddingHeight = 0;
    let mapPaddingWidth = 0;
    if (currentZoom <= 2) {
      // console.log("Leaving Bounds!");
    } else if (currentZoom === 3){
      mapPaddingWidth = 50;
      mapPaddingHeight = 25;
    } else if (currentZoom == 4) {
      mapPaddingWidth = 10;
      mapPaddingHeight = 5;
    }
    const mapOffSetLat = mapPaddingHeight;
    const mapOffSetLng = mapPaddingWidth;
    const southernBoundary = CurrentMapBoundaries._southWest.lat - mapOffSetLat;
    const northernBoundary = CurrentMapBoundaries._northEast.lat + mapOffSetLat
    const westernBoundary = CurrentMapBoundaries._southWest.lng - mapOffSetLng;
    const easternBoundary = CurrentMapBoundaries._northEast.lng + mapOffSetLng;
    const MapBoundaries = {
      north: northernBoundary,
      south: southernBoundary,
      east: easternBoundary,
      west: westernBoundary
    };

    // console.log("MapBoundaries: ", MapBoundaries);
    // console.log("northernBoundary: ", northernBoundary);
    // console.log("southernBoundary: ", southernBoundary);
    // console.log("easternBoundary: ", easternBoundary);
    // console.log("westernBoundary: ", westernBoundary);

    let starsCurrentlyInView = _.filter(this.state.GalacticPlanetsArray, e => { 
      return e.starInMapView(currentMap, mapWidth, mapHeight, MapBoundaries) === true; 
    });
    let starsCurrentlyVisible = _.filter(this.state.GalacticPlanetsArray, e => { 
      // console.log("Star is currently in view: ", e);
      // console.log("starVisible: ", starVisible);
      return e.starIsVisible(currentZoom) === true; 
    });
    const starsInViewSet = new Set(starsCurrentlyInView);
    const starsVisible = new Set(starsCurrentlyVisible);
    let union = new Set([...starsInViewSet, ...starsVisible]);
    let intersectionMap = (currentZoom > 3)? new Set([...starsInViewSet].filter(x => starsVisible.has(x))) : new Set([...starsVisible]);
    // console.log("starsCurrentlyInView: ", starsCurrentlyInView);
    // console.log("starsAtZoomLevel: ", starsAtZoomLevel);
    // console.log("starsCurrentlyVisible: ", starsCurrentlyVisible);
    // console.log("GalacticPlanetsSet: ", this.state.GalacticPlanetsSet);
    // console.log("starsInViewSet: ", starsInViewSet);
    // console.log("starsVisible: ", starsVisible);
    // console.log("union: ", union);
    console.log("intersectionMap: ", intersectionMap);
    // console.log("intersectionMapDuo: ", intersectionMapDuo);
    console.log("previousIntersectionMap: ", this.state.previousIntersectionMap);
    const starMapsEqual = eqSet(intersectionMap, this.state.previousIntersectionMap);
    const unionOfIntersections = new Set([...intersectionMap, ...this.state.previousIntersectionMap]);
    console.log("Equal to previous star maps: ", starMapsEqual);
    console.log("unionOfIntersections: ", unionOfIntersections);

    if( !starMapsEqual || (this.state.previousIntersectionMap.size === 0 ) ) {
      intersectionMap.forEach(function(PlanetarySystem, sameItem) {
        if(!PlanetarySystem.hasOwnProperty('latLng')) {
          if(PlanetarySystem.lat === null && PlanetarySystem.lng === null) {
            // console.log("currentStar data has lat: ", currentStarData.lat);
            const starLngLat = PlanetarySystem.LngLat;
            const currentLatLng = L.latLng(starLngLat[1], starLngLat[0]);
            // console.log("currentLatLng: ", currentLatLng);
            PlanetarySystem['lat'] = currentLatLng[1];
            PlanetarySystem['lng'] = currentLatLng[0];
            PlanetarySystem[i].latLng = currentLatLng;
          } else {
            const currentLatLng = L.latLng(PlanetarySystem.lat, PlanetarySystem.lng);
            // console.log("currentLatLng: ", currentLatLng);
            PlanetarySystem.latLng = currentLatLng;
          }
        }
        // console.log("PlanetarySystem: " + typeof PlanetarySystem);
        stellarComponentsArray.push( <StarSystem key={PlanetarySystem.system} StarObject={PlanetarySystem} zoom={currentZoom} map={currentMap} labels={true}  /> );
        starSystemArray.push(PlanetarySystem);
      });  
    } else {
      console.log("star components: ", this.state.StarMapComponents);
      stellarComponentsArray = this.state.StarMapComponents;
    }

    this.setState({previousIntersectionMap: intersectionMap});
    console.log("star components: ", stellarComponentsArray);
    console.log("Star Systems components created: ", starSystemArray.length);
    // console.log("zoom: ", currentZoom);
    const starSystemSet = new Set(starSystemArray);
    let intersectionOnCreation = new Set([...starSystemSet].filter(x => intersectionMap.has(x)));
    let unionOnCreation = new Set([...starsInViewSet, ...intersectionMap]);
    // console.log("intersection of two sets: ", intersectionOnCreation);
    // console.log("union of two sets: ", unionOnCreation);
    console.log("intersectionMap from above: ", intersectionMap);
    console.log("Star System render: ", starSystemSet);
    console.log("****StarMap Completed!****");
    // const starMapsEqual = eqSet(intersectionMap, starSystemSet);
    // console.log("star maps equal: ", starMapsEqual);
    console.log("\n\n");
    return stellarComponentsArray;
  }

  componentWillReceiveProps(newProps) {
    this.props.dispatch( zoomChangeStatus() );
    // console.log("Props update MapMain: ", newProps);
    let StarMapComponents = [];
    // StarMapComponents = this.createStarMap();
    // this.setState({StarMapComponents: StarMapComponents});
    // console.log("Rendering map has fired: ", this.props.renderMap);
    // console.log("Zooming the map has fired: ", this.props.zoomChange);
    if(this.props.renderMap ||  this.props.zoomChange) {
      StarMapComponents = this.createStarMap();
      this.setState({StarMapComponents: StarMapComponents});
      console.log("Rendering map has fired: ", this.props.renderMap);
      console.log("Zooming the map has fired: ", this.props.zoomChange);
      // this.props.dispatch( renderMapOff() );
    } else {
      StarMapComponents = this.state.StarMapComponents;
    }
    // StarMapComponents = this.createStarMap();
    console.log("Number of StarMapComponents in newProps: ", StarMapComponents.length);
  }    

  render() {
  	const zIndex = 290;
    console.log("this.props.render: ", this.props);
    console.log("this.props.mapMove: ", this.props.mapMove);
    console.log("this.props.zoom: ", this.props.zoom);
    const StarMapComponents = this.state.StarMapComponents;
    console.log("\n\nStarMapComponents in render: ", StarMapComponents.length);
    if(this.props.mapMove) {
      console.log("map move is rendering the map\n\n");
    } else if(this.props.zoomChange) {
      console.log("zoomChange hasfired map\n\n");
    } else {
      console.log("Something besides map move and zoom is rendering the map: ", this.props);
    }
  	return (
  		<Pane name="star-pane" style={{zIndex: zIndex}}>
  			<FeatureGroup  onZoomend={e => this.onZoomend(e)}>  
          { this.state.StarMapComponents }
  			</FeatureGroup>
  		</Pane>
  	)
  }
}

function eqSet(as, bs) {
  return as.size === bs.size && all(isIn(bs), as);
}

function all(pred, as) {
  for (var a of as) if (!pred(a)) return false;
  return true;
}

function isIn(as) {
  return function (a) {
      return as.has(a);
  };
}

const mapStateToProps = (state = {}) => {
  return Object.assign({}, state);
};

// export default StarMap;
export default connect(mapStateToProps)(StarMap);