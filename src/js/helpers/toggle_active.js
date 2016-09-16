(function() {

    var $document = $(document);

    $document.on('click', '[data-toggle-active]', function(event) {
        var classes = $(this).attr('data-toggle-active');
        if (classes.indexOf(' ') > 0) {
            var classesArray = classes.split(' ');
            for (var i = 0; i < classesArray.length; i++) {
                $('.' + classesArray[i]).toggleClass(window.project.classes.states.active);
            }
        } else {
            $('.' + classes).toggleClass(window.project.classes.states.active);
        }
        event.preventDefault();
    });

}());
