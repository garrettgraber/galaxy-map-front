

export default class Point {
  constructor(
  	system,
    lat,
    lng
  ) {
  	this.system = system;
    this.lat = lat;
    this.lng = lng;
  }

  normalizeLng() {
    return this.lng / 2.0;
  }

  coordinatesNormalized() {
  	const normalizedCoordinates = [this.lat, this.normalizeLng()];
    return normalizedCoordinates;
  }
  coordinates() {
		const coordinatesLatLng = [this.lat, this.lng];
		return coordinatesLatLng;
  }
};