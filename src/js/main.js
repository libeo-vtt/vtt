var App = {};

// ------------------------------- //
//             Vendors             //
// ------------------------------- //

var $ = require('jquery');
var upload = require('upload');
var waitForImages = require('waitforimages');
var focusable = require('focusable');
var buttonize = require('buttonize');
var eminize = require('eminize');

// ------------------------------- //
//             Helpers             //
// ------------------------------- //

// Helpers
var helpers = require('./helpers');

// ------------------------------- //
//             Modules             //
// ------------------------------- //

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

// Folders
var folder = require('vtt-folder');
$('.folder').folder();

// Sliders
var slider = require('vtt-slider');
$('.slider').slider();

// Tabs
var tab = require('vtt-tab');
$('.tab').tab();

// Set global variable
window.App = App;
