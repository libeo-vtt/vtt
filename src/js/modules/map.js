// --------------------------- //
//             Map             //
// --------------------------- //

var $ = require('jquery');

function Map(obj, config) {
    this.map = obj;
    this.config = $.extend({}, config);

    this.bindEvents();
}

$.extend(Map.prototype, {
    bindEvents: function() {
        this.map.filter('.is-locked').each(function(index, element) {
            $(element).on('mousedown', function() {
                $(this).addClass('is-active').find('iframe').css('pointer-events', 'auto');
            });
            $(element).find('iframe').on('mouseout', function() {
                $(this).css('pointer-events', 'none').parent().removeClass('is-active');
            });
        });
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Map($(element), config);
    });
};
