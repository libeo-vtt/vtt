{{HEADER}}

var $ = require('jquery');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

inherits({{MODULE_NAME}}, EventEmitter);

function {{MODULE_NAME}}(obj, config) {

    this.{{MODULE_NAME_LOWERCASE}} = obj;
    this.classes = window.PROJECT_NAME.Settings.Classes;

    // Default configuration
    this.config = $.extend({}, config);

    // Component initialization
    this.init();

}

$.extend({{MODULE_NAME}}.prototype, {

    // Component initialization
    init: function() {
        console.log('Module {{MODULE_NAME_LOWERCASE}} initiated.');
    }

});

// Export component
module.exports = function(obj, config) {
    // Loop through each object
    return obj.map(function(index, element) {
        return new {{MODULE_NAME}}($(element), config);
    });
};
