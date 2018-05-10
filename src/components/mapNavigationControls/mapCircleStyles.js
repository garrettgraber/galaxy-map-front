
const bottomBase = 40;

export const MapControlsContainerStyle = {
	bottom: bottomBase,
	right: 10,
	height: 220,
	width: 160,
	zIndex: 11,
	position: 'fixed'
};

export const ZoomContainerStyle = {
	height: 40
};

export const ZoomButtonContainerStyle = {
	height: '100%',
	width: '50%',
	display: 'inline-block'
};

export const ZoomIncreaseButtonStyle = {
	verticalAlign: "top",
	float: 'left',
	width: "80%",
	borderTopRightRadius: 25,
	borderBottomRightRadius: 25
};

export const ZoomDecreaseButtonStyle = {
	verticalAlign: "top",
	float: 'right',
	borderTopLeftRadius: 25,
	borderBottomLeftRadius: 25,
	width: "80%"
};

export const MapPanButtonsContainerStyle = {
	height: 160,
	position: 'fixed',
	bottom: bottomBase + 5
};

const circleSideLength = 160;
const quarterSideLength = circleSideLength / 2.0;

export const CircleStyle = {
	cursor: 'pointer',
	display: 'block',
  padding: 0,
  width: circleSideLength,
  height: circleSideLength,
  border: 1,
  borderRadius: '50%',
  overflow: 'hidden'
};

export const PanQuarterStyle = {
  display: 'table-cell',
  float: 'left',
  margin: 0,
  padding: 0,
  width: quarterSideLength,
  height: quarterSideLength,
  border: '1px solid white',
  backgroundColor: '#337AB7',
  color: 'white'
};

export const HandleUpPanStyle = {
	position: 'relative',
	top: '30%',
	left: '40%',
	transform: 'rotate(45deg)',
	fontSize: '28pt'
};

export const HandleRightPanStyle = {
	position: 'relative',
	top: '30%',
	left: '30%',
	transform: 'rotate(45deg)',
	fontSize: '28pt'
};

export const HandleLeftPanStyle = {
	position: 'relative',
	top: '20%',
	left: '40%',
	transform: 'rotate(45deg)',
	fontSize: '28pt'
};

export const HandleDownPanStyle = {
	position: 'relative',
	top: '18%',
	left: '30%',
	transform: 'rotate(45deg)',
	fontSize: '28pt'
};

const galaxyButtonSideLength = 50;
const galaxyButtonBorderRadius =  galaxyButtonSideLength / 2.0;

export const GalaxyHomeButtonContainerStyle = {
	height: galaxyButtonSideLength,
	width: galaxyButtonSideLength,
	borderRadius: galaxyButtonBorderRadius,
	position: 'fixed',
	bottom: bottomBase + 60,
	right: 63,
	zIndex: 12
};

export const GalaxyHomeButtonStyle = {
	width: galaxyButtonSideLength,
	height: galaxyButtonSideLength,
	fontSize: 18,
	lineHeight: 1.33,
	borderRadius: galaxyButtonBorderRadius,
	backgroundColor: 'black',
	verticalAlign: 'middle',
	display: 'block',
	margin: '0 auto',
	position: 'relative'
};

export const GalaxyHomeButtonMobileStyle = {
	width: galaxyButtonSideLength,
	height: galaxyButtonSideLength,
	fontSize: 18,
	lineHeight: 1.33,
	borderRadius: galaxyButtonBorderRadius,
	backgroundColor: 'black',
	verticalAlign: 'middle',
	display: 'block',
	position: 'fixed',
	// bottom: 20,
	bottom: '7%',
	right: 0,
	zIndex: 12,
	border: '2px solid #49fb35'
};

export const GalaxyImageStyle = {
	width: galaxyButtonBorderRadius,
	height: galaxyButtonBorderRadius
};

