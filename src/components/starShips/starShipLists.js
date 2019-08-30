




export const galacticStarShipsList = [
  {
    name: "Home One",
    speed: 10.0,
    location: [0, 0],
    Course: {
      jumpCoordinates: [],
      jumpDistances: [],
      jumpAngles: [],
      startIsFreeSpace: false,
      endIsFreeSpace: false,
      StartPoint: {},
      EndPoint: {}
    },
    icon: '../../images/icons/rebel-cruiser/Star-Wars-Mon-Calamari-Star-Cruiser-48x48.png'
  },
  {
    name: "Millennium Falcon",
    speed: 20.0,
    location: [0, 0],
    icon: '../../images/icons/falcon-icons/falcon-color-small.png',
    Course: {}
  }
];

export default () => {
	return { galacticStarShipsList }
};