import {Map, View, Feature, Overlay} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector} from 'ol/source';
import {defaults as controlDefaults} from 'ol/control';
import {defaults as interactionDefaults} from 'ol/interaction';
import {fromLonLat} from 'ol/proj';
import {Point} from 'ol/geom';

const position = fromLonLat([-1.145402, 46.158186]),
template = '<b>Je vous acceuil ici !</b><br />22 Quai Louis Durand 17000 La Rochelle';

var map = new Map({
	target: 'map',
	controls: controlDefaults(),
	interactions: interactionDefaults(),
	loadTilesWhileAnimating: true,
	loadTilesWhileInteracting: true,
	layers: [
		new TileLayer({
			source: new OSM()
		})
	],
	view: new View({
		center: position,
		zoom: 14
	})
});

var layer = new VectorLayer({
	source: new Vector({
		features: [
			new Feature({
				geometry: new Point(position)
			})
		]
	})
});

map.addLayer(layer);

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new Overlay({
	element: container,
	autoPan: true,
	autoPanAnimation: {
		duration: 250
	}
});
map.addOverlay(overlay);

closer.onclick = function() {
	overlay.setPosition(undefined);
	closer.blur();
	return false;
};
map.on('singleclick', function (event) {
	if (map.hasFeatureAtPixel(event.pixel) === true) {
		var coordinate = event.coordinate;

		content.innerHTML = template;
		overlay.setPosition(coordinate);
	} else {
		overlay.setPosition(undefined);
		closer.blur();
	}
});

//IIFE - Immediately Invoked Function Expression
(function($, window, document) {

	// The $ is now locally scoped 

	// Listen for the jQuery ready event on the document
	$(function() {

		// The DOM is ready!
		content.innerHTML = template;
		overlay.setPosition(position);
	});

	// The rest of the code goes here!

}(window.jQuery, window, document));
//The global jQuery object is passed as a parameter