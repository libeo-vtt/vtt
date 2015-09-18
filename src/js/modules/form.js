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
    this.classes = window.PROJECT_NAME.Settings.Classes;

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

    // Bind errors events with actions
    bindErrorsEvents: function() {
        // Scroll and focus input on error click
        this.form.find('.errors a').on('click', $.proxy(function(e) {
            var label = this.form.find(e.currentTarget.hash).parents('.field').find('label'),
                input = this.form.find(e.currentTarget.hash);
            input.focus();
            $(window).scrollTop(label.offset().top);
            e.preventDefault();
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
        var data = $(input).val();
        var value = this.isNumber(data) ? parseInt(data) : data;
        var validationTerms = this.getValidationTerms(input);
        var empty = false;

        if (validationTerms) {
            _.each(validationTerms, $.proxy(function(validationTerm) {
                var valid = true,
                    term = this.getTerm(validationTerm),
                    modifier = this.getModifier(validationTerm),
                    compare = this.getCompare(input, term);
                if (!this.isNumber(value) && this.isNumber(compare)) {
                    value = value.length;
                }
                if (term === 'regex') {
                    var regex = new RegExp(compare);
                    valid = regex.test(value);
                } else if (modifier !== false) {
                    valid = is[modifier][term](value, compare) ? valid : false;
                } else {
                    valid = is[term](value, compare) ? valid : false;
                }
                if (!valid && term === 'empty') {
                    empty = true;
                    this.newError(input, this.getErrorMessage(input, term));
                }
                if (!valid && !empty) {
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
            checkedElements = [],
            empty = false;

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
                        empty = true;
                        this.newFieldsetError(fieldset, this.getErrorMessage(fieldset, term));
                    }
                } else {
                    if (modifier !== false) {
                        valid = is[modifier][term](checkedElements.length, compare) ? valid : false;
                    } else {
                        valid = is[term](checkedElements.length, compare) ? valid : false;
                    }
                    if (!valid && !empty) {
                        this.newFieldsetError(fieldset, this.getErrorMessage(fieldset, term));
                    }
                }
            }, this));
        }
    },

    // Get validation terms
    getValidationTerms: function(input) {
        var data = $(input).data('validate');
        return data !== undefined ? data.trim().split(' ') : false;
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

    // Reset form errors
    resetErrors: function() {
        this.form.find('.field').removeClass(this.classes.error);
        this.form.find('.error-message, .error-message-explanation').remove();
    },

    // Throw new input error
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

    // Throw new fieldset error
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

    // Display errors summary
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
            this.bindErrorsEvents();
        }
    },

    // Check if given value is a number
    isNumber: function(value) {
        if (!value) return false;
        return value.toString().match(/^[0-9]+$/) && !isNaN(parseInt(value));
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Form($(element), config);
    });
};
