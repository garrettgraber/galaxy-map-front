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
		return (this.startOrEndPoinstHaveChanged() || this.hyperspacePathsHaveChanged() || this.activeAndSearchAreTheSame())? true : false;
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

};


function validatePoints(systemName) {
	return (systemName === '')? false : true;
}