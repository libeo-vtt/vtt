// ---------------------------- //
//             Main             //
// ---------------------------- //
// This file is called after every other javascript files

// Modules
// window.project.modules.exampleModule = $('.module').module();

// Google Fonts
WebFont.load({
    google: {
        families: ["Roboto"]
    },
    active: function() {
        $(document).trigger('googleFontsLoaded');
    }
});
