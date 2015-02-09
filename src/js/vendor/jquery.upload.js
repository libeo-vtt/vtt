/*****************************************************
 *
 * Change the file uploads to make them accessible
 * @author Danny Turcotte <danny.turcotte@libeo.com>
 *
 * $('#my-file-upload').accessibleUpload();
 *
 *****************************************************/
(function($, window, document, undefined) {

    var methods = {
        //Binds event to each object of the selector and creates the holder
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

        //if you want to remove the plugin
        destroy: function() {
            $(this).next('.aif').remove();
            $(this).unbind('.aif');
        },

        //Creates html to hold the filename and delete button
        _createFilenameHolder: function(input) {
            return '<span class="lbo-aif" style="display: none;"><span class="lbo-aif-filename" aria-live="polite"></span></span>';
        },

        //Callback for event when a file is selected
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

        //Extract the filename of the path
        _getFilename: function(filename) {

            filename = filename.split('\\');

            return filename.pop();
        },

        //Callback for event when remove file selected
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

    //Initiate the plugin
    $.fn.accessibleUpload = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.accessibleUpload');
        }
    };


})(jQuery);
