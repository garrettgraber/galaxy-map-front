import _ from 'lodash';

class BlankPoint {
  constructor() {
    this.system = "";
  }
}


export default class NavigationPoints {
  constructor(Options) {
  	this.StartPoint = Options.StartPoint || new BlankPoint();
    this.EndPoint = Options.EndPoint || new BlankPoint();
    this.ActiveStartPoint = Options.ActiveStartPoint || new BlankPoint();
    this.ActiveEndPoint = Options.ActiveEndPoint || new BlankPoint();
    this.changeInPoints = Options.changeInPoints;
  }

  filteredPlanetsArray(GalacticPlanetsArray) {
    const startPointSystem = this.StartPoint.system;
    const endPointSystem = this.EndPoint.system;
    const activeStartPointSystem = this.ActiveStartPoint.system;
    const activeEndPointSystem = this.ActiveEndPoint.system;
    let navigationPoints = [startPointSystem, endPointSystem, activeStartPointSystem, activeEndPointSystem];
    navigationPoints = _.uniq(navigationPoints);
    let navigationPointsFilteredEmptyString = navigationPoints.filter(e => e != "");
    const navigationPointsFiltered  = navigationPointsFilteredEmptyString.filter(e => e.slice(0, 11) !== 'Empty Space');
    if(navigationPointsFiltered.length > 0) {
      const filteredGalacticPlanetsArray = _.filter(GalacticPlanetsArray, (v) => !_.includes(navigationPoints, v.system));
      return filteredGalacticPlanetsArray;
    } else {
      return GalacticPlanetsArray;
    }
  }
};