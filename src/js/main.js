var $ = require('jquery');
var upload = require('upload');
var waitForImages = require('waitforimages');

// Helpers
var helpers = require('./helpers');

// Make every upload input accessible
$('input[type="file"]').accessibleUpload();

// Webfont
var Webfont = require('./modules/webfont.js');
var webfont = Webfont({
    fonts: ['Roboto', 'Roboto:bold', 'Roboto:italic']
});

// Map
var Map = require('./modules/map.js');
var map = Map($('.map-wrapper'));
