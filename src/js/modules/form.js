// ---------------------------- //
//             Form             //
// ---------------------------- //

var $ = require('jquery');
var _ = require('lodash');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var is = require('is');

function Form(obj, config) {
    this.form = obj;
    this.classes = window.App.Settings.Classes;

    this.config = $.extend({
        modifiers: {
            '!': 'not'
        }
    }, config);

    this.errors = [];
    this.init();
}

inherits(Form, EventEmitter);

$.extend(Form.prototype, {

    // Component initialization
    init: function() {
        this.bindEvents();
    },

    // Bind events with actions
    bindEvents: function() {
        this.form.on('submit', $.proxy(function(e) {
            this.resetErrors();
            this.validate();
            this.displayErrors();
            if (this.errors.length > 0) {
                e.preventDefault();
            }
        }, this));
    },

    // Catch form submit and validate values
    validate: function() {
        var inputs = this.form.find('input, textarea, select, fieldset');
        this.errors = [];
        inputs.each($.proxy(function(index, input) {
            if (input.tagName.toLowerCase() === 'fieldset') {
                this.validateFieldset(input);
            } else {
                this.validateInput(input);
            }
        }, this));
    },

    // Validate current input
    validateInput: function(input) {
        var data = $(input).val(),
            value = this.isNumber(data) ? parseInt(data) : data,
            validationTerms = this.getValidationTerms(input);

        if (validationTerms) {
            _.each(validationTerms, $.proxy(function(validationTerm) {
                var valid = true,
                    term = this.getTerm(validationTerm),
                    modifier = this.getModifier(validationTerm),
                    compare = this.getCompare(input, term);
                if (modifier !== false) {
                    valid = is[modifier][term](value, compare) ? valid : false;
                } else {
                    valid = is[term](value, compare) ? valid : false;
                }
                if (!valid) {
                    this.newError(input, this.getErrorMessage(input, term));
                }
            }, this));
        }
    },

    // Validate current fieldset (for radio button and checkboxes)
    validateFieldset: function(fieldset) {
        var inputs = $(fieldset).find('input'),
            validationTerms = this.getValidationTerms(fieldset),
            label = $(fieldset).find('legend'),
            checkedElements = [];

        inputs.each(function(index, el) {
            if ($(el).is(':checked')) checkedElements.push(el);
        });

        if (validationTerms) {
            _.each(validationTerms, $.proxy(function(validationTerm) {
                var valid = true,
                    term = this.getTerm(validationTerm),
                    modifier = this.getModifier(validationTerm),
                    compare = this.getCompare(fieldset, term);
                if (term === 'empty') {
                    if (modifier !== false) {
                        valid = is[modifier][term](checkedElements, compare) ? valid : false;
                    } else {
                        valid = is[term](checkedElements, compare) ? valid : false;
                    }
                    if (!valid) {
                        this.newFieldsetError(fieldset, this.getErrorMessage(fieldset, term));
                    }
                } else {
                    if (modifier !== false) {
                        valid = is[modifier][term](checkedElements.length, compare) ? valid : false;
                    } else {
                        valid = is[term](checkedElements.length, compare) ? valid : false;
                    }
                    if (!valid) {
                        this.newFieldsetError(fieldset, this.getErrorMessage(fieldset, term));
                    }
                }
            }, this));
        }
    },

    // Get validation terms
    getValidationTerms: function(input) {
        var data = $(input).data('validate');
        return data !== undefined ? data.split(' ') : false;
    },

    // Normalize given term name
    getTerm: function(term) {
        return term.charAt(0) === '!' ? term.substring(1) : term;
    },

    // Get term modifier
    getModifier: function(term) {
        var modifier = this.config.modifiers[term.charAt(0)];
        return modifier !== undefined ? modifier : false;
    },

    // Get term comparison value
    getCompare: function(input, term) {
        var data = $(input).data('compare-' + term.toLowerCase());
        if (data === undefined) return null;
        return this.isNumber(data) ? parseInt(data) : data;
    },

    // Get term error message
    getErrorMessage: function(input, term) {
        var data = $(input).data('message-' + term.toLowerCase());
        return data !== undefined ? data : '';
    },

    resetErrors: function() {
        this.form.find('.field').removeClass(this.classes.error);
        this.form.find('.error-message, .error-message-explanation').remove();
    },

    newError: function(input, message) {
        var id = $(input).attr('id'),
            label = this.form.find('label[for="' + id + '"]'),
            field = label.parents('.field').eq(0),
            markup = '<a href="#' + id + '">' + message + '</a>';

        field.addClass(this.classes.error);
        if (label.find('.error-message').length === 0) {
            label.prepend('<span class="error-message">' + this.form.data('errors-prefix') + '</span>');
        }
        label.append('<span class="error-message-explanation"><span>' + message + '</span></span>');
        this.errors.push(markup);
    },

    newFieldsetError: function(fieldset, message) {
        var $fieldset = $(fieldset),
            id = $fieldset.attr('id'),
            legend = $fieldset.find('legend'),
            markup = '<a href="#' + id + '">' + message + '</a>';

        $fieldset.addClass(this.classes.error);
        if (legend.find('.error-message').length === 0) {
            legend.prepend('<span class="error-message">' + this.form.data('errors-prefix') + '</span>');
        }
        legend.append('<span class="error-message-explanation"><span>' + message + '</span></span>');
        this.errors.push(markup);
    },

    displayErrors: function() {
        this.form.find('.errors').remove();
        if (this.errors.length > 0) {
            this.form.prepend('<div class="errors"></div>');
            this.form.errors = this.form.find('> .errors');
            this.form.errors.append('<p>' + this.form.data('errors-message').replace('{n}', this.errors.length).replace('{s}', this.errors.length > 1 ? 's' : '') + '</p>');
            this.form.errors.append('<ul></ul>');
            this.form.errorsList = this.form.find('> .errors > ul');
            _.each(this.errors, $.proxy(function(error) {
                this.form.errorsList.append('<li>' + error + '</li>');
            }, this));
        }
    },

    isNumber: function(value) {
        if (value === undefined) return false;
        return value.toString().match(/^[0-9]+$/) && !isNaN(parseInt(value));
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Form($(element), config);
    });
};
