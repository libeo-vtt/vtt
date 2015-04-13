var $ = require('jquery');

module.exports = (function() {

    var parameter = 'socket';

    window.setTimeout(function() {
        var url = window.location.search.substring(1);
        var urlParameters = url.split('&');
        for (var i = 0; i < urlParameters.length; i++) {
            var parameterName = urlParameters[i].split('=');
            if (parameterName[0] === parameter && parameterName[1] === 'false') {
                window.___browserSync___.socket.close();
            }
        }
    }, 300);

}());
