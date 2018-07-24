export default class GalacticPoint {
  constructor(
  	x,
    y
  ) {
  	this.x = x;
    this.y = y;
  }

  quadrant() {
    const xIsPositive = x >= 0;
    const yIsPositive = y >= 0;
    if(xIsPositive && yIsPositive) {
      return 1;
    } else if(xIsPositive && !yIsPositive) {
      return 2;
    } else if(!xIsPositive && !yIsPositive) {
      return 3;
    } else if(!xIsPositive && yIsPositive) {
      return 4;
    }
  }
};
