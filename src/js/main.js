var App = {};

// Vendors
var $ = require('jquery');
var upload = require('upload');
var waitForImages = require('waitforimages');

// Helpers
var helpers = require('./helpers');

// Make every upload input accessible
$('input[type="file"]').accessibleUpload();

// Webfont
var Webfont = require('./modules/webfont.js');
App.Webfont = Webfont({
    fonts: ['Roboto', 'Roboto:bold', 'Roboto:italic']
});

// Map
var Map = require('./modules/map.js');
App.Map = Map($('.map-wrapper'));

// Set global variable
window.App = App;
