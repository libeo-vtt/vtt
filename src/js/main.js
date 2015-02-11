// App
var App = require('./app.js');

// Helpers
var helpers = require('./helpers');

// Webfont
var Webfont = require('./modules/webfont.js');
App.Webfont = Webfont({
    fonts: ['Roboto', 'Roboto:bold', 'Roboto:italic']
});

// Maps
var Map = require('./modules/map.js');
App.Components.Maps = Map($('.map-wrapper'));

// Folders
var Folder = require('./modules/folder.js');
App.Components.Folders = Folder($('.folder'));

// Sliders
var Slider = require('./modules/slider.js');
App.Components.Sliders = Slider($('.slider'));

// Tabs
var Tab = require('./modules/tab.js');
App.Components.Tabs = Tab($('.tab'));

// Forms
var Form = require('./modules/form.js');
App.Components.forms = Form($('form'));
