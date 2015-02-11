// ------------------------------ //
//             Sample             //
// ------------------------------ //

var $ = require('jquery');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

function Sample(obj, config) {
    this.sample = obj;
    this.classes = window.App.Settings.Classes;

    this.config = $.extend({

    }, config);

    this.init();
}

inherits(Sample, EventEmitter);

$.extend(Sample.prototype, {
    init: function() {

    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Sample($(element), config);
    });
};
