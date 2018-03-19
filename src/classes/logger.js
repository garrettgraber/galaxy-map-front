export default class Logger {
  constructor() {
    this.active = true;
  }

  setActive() {
    this.active = true;
  }

  setInActive() {
    this.active = false;
  }
 
  log(message) {
    if(this.active) {
      console.log(message);
    }
  }

  time(message) {
    if(this.active) {
      console.time(message);
    }
  }

  timeEnd(message) {
    if(this.active) {
      console.timeEnd(message);
    }
  }
};
