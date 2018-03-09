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
    this.ActiveSystem = Options.ActiveSystem || new BlankPoint();
  }

  filteredPlanetsArray(GalacticPlanetsArray) {
    const startPointSystem = this.StartPoint.system;
    const endPointSystem = this.EndPoint.system;
    const activeStartPointSystem = this.ActiveStartPoint.system;
    const activeEndPointSystem = this.ActiveEndPoint.system;
    const currentActiveSystem = this.ActiveSystem.system;
    let navigationPoints = [startPointSystem, endPointSystem, activeStartPointSystem, activeEndPointSystem, currentActiveSystem];
    navigationPoints = _.uniq(navigationPoints);
    let navigationPointsFilteredEmptyString = navigationPoints.filter(e => e != "");
    const navigationPointsFiltered  = navigationPointsFilteredEmptyString.filter(e => e.slice(0, 11) !== 'Empty Space');
    if(navigationPointsFiltered.length > 0) {
      const filteredGalacticPlanetsArray = _.filter(GalacticPlanetsArray, (v) => !_.includes(navigationPointsFiltered, v.system));
      return filteredGalacticPlanetsArray;
    } else {
      return GalacticPlanetsArray;
    }
  }
};