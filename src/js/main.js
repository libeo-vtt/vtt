// ---------------------------- //
//             Main             //
// ---------------------------- //

// This file is called after every other javascript files

// Modules
$('.tab').tab();
$('form').form();
$('.slider').slider();
$('.folder-group').folder();

// Google Fonts
WebFont.load({
    google: {
        families: ["Roboto"]
    },
    active: function() {
        $(document).trigger('googleFontsLoaded');
    }
});
