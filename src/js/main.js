// Project
var PROJECT_NAME = require('./project.js');

// Helpers
var Helpers = require('./helpers');

// Webfont
var Webfont = require('./modules/webfont.js');
PROJECT_NAME.Webfont = Webfont({
    fonts: ['Roboto', 'Roboto:bold', 'Roboto:italic']
});

// Maps
var Map = require('./modules/map.js');
PROJECT_NAME.Components.Maps = Map($('.map-wrapper'));

// Folders
var Folder = require('./modules/folder.js');
PROJECT_NAME.Components.Folders = Folder($('.folder'));

// Sliders
var Slider = require('./modules/slider.js');
PROJECT_NAME.Components.Sliders = Slider($('.slider'));

// Tabs
var Tab = require('./modules/tab.js');
PROJECT_NAME.Components.Tabs = Tab($('.tab'));

// Forms
var Form = require('./modules/form.js');
PROJECT_NAME.Components.forms = Form($('form'));

// Tooltip
var Tooltip = require('./modules/tooltip.js');
PROJECT_NAME.Components.tooltips = Tooltip($('.tooltip'));

//flowtext 
var Flowtext = require('./modules/flowtext.js');
PROJECT_NAME.Components.Flowtext = Flowtext($('.js-flow'));





