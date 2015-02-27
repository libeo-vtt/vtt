/*
* jQuery Accessible Upload file
* @author Danny Turcotte <danny.turcotte@libeo.com>
*
* Usage: $('#my-file-upload').accessibleUpload();
*/
(function($, window, document, undefined) {

    var methods = {
        init: function(options) {
            return this.each(function() {
                var holder = methods._createFilenameHolder(this);

                $(holder).insertAfter($(this));

                $(this).next('.lbo-aif').on('click', 'button', {
                    input: this
                }, methods._fileRemove);

                $(this).on('change.lbo-aif', '', {
                    holder: holder
                }, methods._change);

                $(this).change(function() {
                    $(this).trigger('change.aif');
                });
            });
        },

        destroy: function() {
            $(this).next('.aif').remove();
            $(this).unbind('.aif');
        },

        _createFilenameHolder: function(input) {
            return '<span class="lbo-aif" style="display: none;"><span class="lbo-aif-filename" aria-live="polite"></span></span>';
        },

        _change: function(event) {
            var label = '';

            if (this.title) {
                label = '<span class="visuallyhidden">' + this.title + '</span>';
            }

            var filename = methods._getFilename($(this).val());

            $(this).hide();

            if ($(this).next('.lbo-aif').find('button').length === 0) {
                $(this).next('.lbo-aif').append('<button class="btn-supprimer"><span class="visuallyhidden">Supprimer<span class="visuallyhidden"> ' + filename + '.</span></span></button>');
            }

            $(this).next('.lbo-aif')
                .show()
                .find('.lbo-aif-filename')
                .html(label + ' ' + filename)
                .attr('tabindex', 0)
                .focus();
        },

        _getFilename: function(filename) {
            filename = filename.split('\\');
            return filename.pop();
        },

        _fileRemove: function(event) {
            event.preventDefault();
            var clone = $(event.data.input).clone();
            $(event.data.input).replaceWith(clone);
            clone.show()
                .focus()
                .accessibleUpload();

            $(this).closest('.lbo-aif').hide();
            $(this).closest('.lbo-aif-filename').html('');

            return false;
        }
    };

    $.fn.accessibleUpload = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.accessibleUpload');
        }
    };

    $('input[type="file"]').accessibleUpload();

})(jQuery);
