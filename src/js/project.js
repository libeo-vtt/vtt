// ------------------------------- //
//             Project             //
// ------------------------------- //
// This file is called before every other javascript files

// Create global project variable
window.project = window.project || {};

// Initialize project modules
window.project.modules = {};

// Initialize project classes
window.project.classes = {
    states: {
        active: 'is-active',
        open: 'is-open',
        hover: 'is-hover',
        clicked: 'is-clicked',
        extern: 'is-external',
        error: 'is-error',
        zoom: 'is-zoomed'
    }
};
