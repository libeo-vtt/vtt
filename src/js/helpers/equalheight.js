(function() {

    var identifiers = [];

    $(window).on('resize', _.debounce(function() {
        var currentBreakpointIdentifiers = [];
        var currentBreakpoint = window.breakpoints.current;

        // Get all equalheight identifiers
        $('[data-equalheight]').each(function() {
            var ids = $(this).data('equalheight').split(' ');
            _.forEach(ids, function(id) {
                if (!_.contains(identifiers, id)) {
                    identifiers.push(id);
                }
            });
        });

        // Get all equalheight identifiers for current breakpoint
        $('[data-equalheight-' + currentBreakpoint + ']').each(function() {
            var ids = $(this).data('equalheight-' + currentBreakpoint).split(' ');
            _.forEach(ids, function(id) {
                if (!_.contains(currentBreakpointIdentifiers, id)) {
                    currentBreakpointIdentifiers.push(id);
                }
            });
        });

        // Set equalheight for each identifiers
        _.forEach(identifiers, function(id) {
            var elements = $('[data-equalheight~=' + id + ']');
            setEqualheight(elements);
        });

        // Set equalheight for each current breakpoint identifiers
        if (currentBreakpointIdentifiers.length > 0) {
            _.forEach(currentBreakpointIdentifiers, function(id) {
                var elements = $('[data-equalheight-' + currentBreakpoint + '=' + id + ']');
                setEqualheight(elements);
            });
        }
    }, 100)).trigger('resize');

}());

function setEqualheight(elements) {
    var height = 0;
    $(elements).css('height', 'auto');
    elements.waitForImages(function() {
        elements.each(function() {
            var $this = $(this),
                currentHeight = 0;

            $this.css('height', 'auto');
            currentHeight = $this.outerHeight();
            height = (currentHeight > height ? currentHeight : height);
        });
        elements.outerHeight(height);
    });
}
