// ------------------------------- //
//             Webfont             //
// ------------------------------- //

var $ = require('jquery');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var WebfontLoader = require('webfont');

function Webfont(config) {
    if (!(this instanceof Webfont)) return new Webfont(config);

    this.config = $.extend({
        fonts: ['Roboto'],
        eventName: 'load',
        callback: $.noop
    }, config);

    this.init();
}

inherits(Webfont, EventEmitter);

$.extend(Webfont.prototype, {
    init: function() {
        WebfontLoader.load({
            google: {
                families: this.config.fonts
            },
            active: $.proxy(function() {
                this.config.callback();
                this.emit(this.config.eventName);
            }, this)
        });
    }
});

module.exports = Webfont;
