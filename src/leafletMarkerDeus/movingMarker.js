import L from 'leaflet';


import 'leaflet-rotatedmarker';

const noop = () => { };

// const proto_initIcon = L.Marker.prototype._initIcon;
// const proto_setPos = L.Marker.prototype._setPos;

// const oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

// L.Marker.addInitHook(function () {
//     const iconOptions = this.options.icon && this.options.icon.options;
//     let iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
//     if (iconAnchor) {
//         iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
//     }
//     this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom' ;
//     this.options.rotationAngle = this.options.rotationAngle || 0;

//     // Ensure marker keeps rotated during dragging
//     this.on('drag', function(e) { e.target._applyRotation(); });
// });

// L.Marker.include({
//     _initIcon: function() {
//         proto_initIcon.call(this);
//     },

//     _setPos: function (pos) {
//         proto_setPos.call(this, pos);
//         this._applyRotation();
//     },

//     _applyRotation: function () {
//         if(this.options.rotationAngle) {
//             this._icon.style[L.DomUtil.TRANSFORM+'Origin'] = this.options.rotationOrigin;

//             if(oldIE) {
//                 // for IE 9, use the 2D rotation
//                 this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
//             } else {
//                 // for modern browsers, prefer the 3D accelerated version
//                 this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
//             }
//         }
//     },

//     setRotationAngle: function(angle) {
//         this.options.rotationAngle = angle;
//         this.update();
//         return this;
//     },

//     setRotationOrigin: function(origin) {
//         this.options.rotationOrigin = origin;
//         this.update();
//         return this;
//     }
// });




const MovingMarker = L.Marker.extend({
    initialize: function (startLatLng, options) {
        if (options === void 0) { options = {}; }
        this.startLatLng = L.latLng(startLatLng);
        this.isZooming = false;
        this.isPaused = false;
        this.defaultDuration = 1000;
        L.Marker.prototype.initialize.call(this, startLatLng, options);
        this.fire('destination', startLatLng);
        if (!options.destinations || !options.destinations.length) {
            return this.fire('destinationsdrained');
        }
        this.destinations = options.destinations;
        this.step();
    },
    onAdd: function (map) {
        var _this = this;
        L.Marker.prototype.onAdd.call(this, map);
        this.start();
        this.map = map;
        map.addEventListener('zoomstart', function () { _this.isZooming = true; });
        map.addEventListener('zoomend', function () { _this.isZooming = false; });
    },
    step: function () {
        var nextDestination = this.destinations.shift();
        this.fire('destination', nextDestination);
        this.nextLatLng = L.latLng(nextDestination.latLng);
        this.duration = nextDestination.duration || this.defaultDuration;
    },
    start: function () {
        this.startedAt = Date.now();
        this.isPaused = false;
        this.fire('start');
        this.requestAnimationFrameSetLatLng();
    },
    pause: function () {
        this.fire('paused');
        this.isPaused = true;
    },
    requestAnimationFrameSetLatLng: function () {
        if (!this.isPaused) {
            requestAnimationFrame(this.setCurrentLatLng.bind(this));
        }
    },
    setCurrentLatLng: function () {
        var now = Date.now();
        var end = this.startedAt + this.duration;
        // Schedule the next tick
        if (now < end) {
            this.requestAnimationFrameSetLatLng();
        }
        else {
            if (this.destinations.length) {
                // step to next destination
                this.startedAt = Date.now();
                this.startLatLng = this.nextLatLng;
                this.step();
                this.requestAnimationFrameSetLatLng();
            }
            else {
                this.setLatLng(this.nextLatLng);
                return this.fire('destinationsdrained');
            }
        }
        if (!this.isZooming) {
            var t = now - this.startedAt;
            var lat = this.startLatLng.lat + ((this.nextLatLng.lat - this.startLatLng.lat) / this.duration * t);
            var lng = this.startLatLng.lng + ((this.nextLatLng.lng - this.startLatLng.lng) / this.duration * t);
            this.setLatLng({ lat: lat, lng: lng });
            var rawPoint = this.map.project({ lat: lat, lng: lng });
            var point = rawPoint._subtract(this.map.getPixelOrigin());
            L.DomUtil.setPosition(this.getElement(), point);
        }
        return;
    },
    setRotationAngle: L.Marker.prototype.setRotationAngle,
    setRotationOrigin: L.Marker.prototype.setRotationOrigin
});


// console.log("L.Marker.prototype: ", L.Marker.prototype);

console.log("L.Marker: ", L.marker([0.13, 0.13]));


export function movingMarkerGenerator(startLatLng, options) {
    if (options === void 0) { options = {}; }
    return new MovingMarker(startLatLng, options);
};
