var App = {};

// Vendors
var $ = require('jquery');
var waitForImages = require('waitforimages');

// Helpers
var helpers = require('./helpers');

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
