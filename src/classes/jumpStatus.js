export default class JumpStatus {
	constructor(JumpOptions) {
		this.startPoint = JumpOptions.startPoint || '';
		this.endPoint = JumpOptions.endPoint || '';
		this.activeStartPoint = JumpOptions.activeStartPoint || '';
		this.activeEndPoint = JumpOptions.activeEndPoint || '';
		this.hyperspacePathCollection = JumpOptions.hyperspacePathCollection || [];
		this.oldStartPoint = JumpOptions.oldStartPoint || '';
		this.oldEndPoint = JumpOptions.oldEndPoint || '';
		this.oldPathCollection = JumpOptions.oldPathCollection || [];
	}

	startPointAndEndPointEqual() {
		return this.pointsAreValid() && systemsAreEqual(this.startPoint, this.endPoint);
	}

	pointsAreValid() {
		return validatePoints(this.startPoint) && validatePoints(this.endPoint);
	}

	startPointAndActiveEqual() {
		return this.startPoint === this.activeStartPoint;
	}

	endPointAndActiveEqual() {
		return this.endPoint === this.activeEndPoint;
	}

	activeAndSearchAreTheSame() {
		return this.startPointAndActiveEqual() && this.endPointAndActiveEqual();
	}

	activeAndSearchAreDifferent() {
		return !this.activeAndSearchAreTheSame();
	}

	startPointHasChanged() {
		return this.startPoint !== this.oldStartPoint;
	}

	endPointHasChanged() {
		return this.endPoint !== this.oldEndPoint;
	}

	startOrEndPoinstHaveChanged() {
		return this.startPointHasChanged() || this.endPointHasChanged();
	}

	hyperspacePathsHaveChanged() {
		return this.hyperspacePathCollection !== this.oldPathCollection;
	}

	hyperspacePathsNotEmpty() {
		return (this.hyperspacePathCollection.length > 0)? true : false;
	}

	hyperspacePathsEmpty() {
		return (this.hyperspacePathCollection.length === 0)? true : false;
	}

	newJumpShouldBeCalculated() {
		return (!this.startPointAndEndPointEqual() && (this.startOrEndPoinstHaveChanged() || this.hyperspacePathsHaveChanged() || this.activeAndSearchAreTheSame()))? true : false;
	}

	jumpClassesString() {
	  let jumpClasses = "hyperspace-navigation-button  pulsating-button-off";
	  const hyperspacePointsAreValid = (validatePoints(this.startPoint) && validatePoints(this.endPoint));
	  if( hyperspacePointsAreValid && (this.hyperspacePathsEmpty() || this.activeAndSearchAreDifferent()) ) {
	    jumpClasses = "navbar-button pulsating-button-ready";
	  } else if(this.hyperspacePathsNotEmpty() && this.activeAndSearchAreTheSame()) {
	    jumpClasses = "hyperspace-navigation-button  button-border-green";
	  }  else {
	    jumpClasses = "hyperspace-navigation-button  pulsating-button-off";
	  }
	  return jumpClasses;
	}

	jumpCanCalculate() {
	  const hyperspacePointsAreValid = (validatePoints(this.startPoint) && validatePoints(this.endPoint));
	  if( hyperspacePointsAreValid && (this.hyperspacePathsEmpty() || this.activeAndSearchAreDifferent()) ) {
	    return true;
	  } else {
	  	return false;
	  }
	}

	statusMessageString() {
	  let message = "Select Start and End Points";
	  const startPointValid = validatePoints(this.startPoint);
	  const endPointValid = validatePoints(this.endPoint);
	  const hyperspacePointsAreValid = (startPointValid && endPointValid);
	  const jumpCanBeCalculated = (this.hyperspacePathsEmpty() || this.activeAndSearchAreDifferent());
	  if(hyperspacePointsAreValid && jumpCanBeCalculated) {
	    message = "Jump Ready to be Calculated";
	  } else if(this.hyperspacePathsNotEmpty() && this.activeAndSearchAreTheSame()) {
	    message = "Jump Successfully Calculated";
	  }
	  return message;
	}

	statusIsComplete() {
		const statusMessage = this.statusMessageString();
		if(statusMessage === "Jump Successfully Calculated") {
			return true;
		} else {
			return false;
		}
	}

};

function pointsAreEqual(point1, point2) {
  const sameName = (point1.system === point2.system)? true : false;
  const sameLatitude = (point1.lat === point2.lat)? true : false;
  const sameLongitude = (point1.lng === point2.lng)? true : false;
  if(sameName && sameLatitude && sameLongitude) {
    return true;
  } else {
    return false;
  }
}

function systemsAreEqual(system1, system2) {
	return (system1 === system2)? true : false;
}

function validatePoints(systemName) {
	return (systemName === '')? false : true;
}