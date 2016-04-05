// ---------------------------- //
//             Main             //
// ---------------------------- //

// This file is called after every other javascript files

// Modules

// Google Fonts
WebFont.load({
    google: {
        families: ["Roboto"]
    },
    active: function() {
        $(document).trigger('googleFontsLoaded');
    }
});
