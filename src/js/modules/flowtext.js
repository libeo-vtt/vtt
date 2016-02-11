// ------------------------------ //
//             Flowtext           //
// ------------------------------ //

var $ = require('jquery');

function Flowtext(obj, config) {

    this.obj = obj;
    this.classes = window.PROJECT_NAME.Settings.Classes;
  
    this.config = $.extend({}, {
        minFontSize: 16,
        maxFontSize: 46,
        minScreenWidth: 768,
        maxScreenWidth: 1920,
        resetForMobile: false,
        setLineHeight: false
    }, config);

    this.init();
}

$.extend(Flowtext.prototype, {

    init: function() {
        $(window).on('resize', $.proxy(function() {
            this.resize();
        }, this)).trigger('resize');
    },
    resize: function() {
        var windowWidth = $(window).width();

        if (windowWidth < this.config.minScreenWidth) {
            if (this.config.resetForMobile) {
                this.setFontSize('');
                this.setLineHeight('');
            } else {
                this.setFontSize(this.config.minFontSize);
                if (this.config.setLineHeight) {
                    this.setLineHeight(this.config.minFontSize + 2);
                }                
            }
        } else if (windowWidth > this.config.maxScreenWidth) {
            this.setFontSize(this.config.maxFontSize);
            if (this.config.setLineHeight) {
                this.setLineHeight(this.config.maxFontSize + 2);
            }
        } else {
            var ratio = (windowWidth - this.config.minScreenWidth) / (this.config.maxScreenWidth - this.config.minScreenWidth);
            var fontSize = this.config.minFontSize + ((this.config.maxFontSize - this.config.minFontSize) * ratio);
            this.setFontSize(fontSize);
            if (this.config.setLineHeight) {
                this.setLineHeight(fontSize + 2);
            }
        }
    },
    setFontSize: function(fontSize) {
        var toRem = (fontSize/16 + "rem");
        this.obj.css('font-size', toRem);
    },
    setLineHeight: function(lineHeight) {
        var unit = lineHeight !== '' ? 'px' : '';
        this.obj.css('line-height', lineHeight + unit);
    },
    resetConfig: function(newConfig) {
        this.config = $.extend({}, newConfig);
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Flowtext($(element), config);
    });
};