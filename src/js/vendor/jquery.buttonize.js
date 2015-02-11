'use strict';
(function($, window, document, undefined) {

    var defaultConfig = {
        a11y: false,
        a11yText: 'Cliquer pour ouvrir',
        unbuttonize: false,
        toTag: ''
    };

    var Buttonize = function(tag, config) {
        this.config = $.extend({}, defaultConfig, config);
        this.tag = $(tag);
    };

    Buttonize.prototype.init = function() {
        var tagHtml = this.tag.html(),
            tagAttr = this.getAttributes(this.tag[0]),
            tagAria = this.config.a11y ? ' aria-live="polite"' : '',
            tagA11yText = this.config.a11y ? '<span class="visuallyhidden">' + this.config.a11yText + '</span>' : '',
            button = '<button ' + tagAttr.join(' ') + tagAria + '>' + tagHtml + tagA11yText + '</button>';

        if (this.config.unbuttonize) {
            button = '<' + this.config.toTag + ' ' + tagAttr.join(' ') + '>' + tagHtml + '</' + this.config.toTag + '>';
        }

        this.tag.replaceWith(button);
        return $(button);
    };

    Buttonize.prototype.getAttributes = function(tag) {
        var self = this;

        return $.map(tag.attributes, function(atrb) {
            var _atrb,
                name = atrb.name || atrb.nodeName,
                value = $(tag).attr(name),
                hregRegEx = /href|data-href/gi;

            if (value === undefined || value === false) return;

            _atrb = name + '="' + value + '"';
            if (self.config.unbuttonize) {
                atrb = _atrb.match(hregRegEx) ? _atrb = _atrb.replace(hregRegEx, 'href') : _atrb;
            } else {
                atrb = _atrb.match(hregRegEx) ? _atrb = _atrb.replace(hregRegEx, 'data-href') : _atrb;
            }

            return atrb;
        });
    };

    $.fn.buttonize = function(config) {
        return this.map(function() {
            var button = new Buttonize(this, config);
            return button.init().toArray();
        });
    };

})(jQuery, window, document);
