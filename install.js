#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var rm = require('rimraf');
var inquirer = require('inquirer');
var glob = require('glob');
var colors = require('colors');
var exec = require('sync-exec');
var project = require('./package.json');

program
    .version(project.version)
    .parse(process.argv);

// Initialisation prompt questions
var questions = [{
    name: 'modules',
    type: 'checkbox',
    message: 'Modules to install:',
    choices: [
        'Folder',
        'Tab',
        'Form',
        'Slider',
        'Map',
        'Lightbox',
        'AccessibleUpload',
        new inquirer.Separator(),
        'Buttonize',
        'Focusable'
    ]
}];

// Prompt user for project informations
inquirer.prompt(questions, function(answers) {
    // Update project values
    var modules = answers.modules;
    var links = {
        Folder: 'https://github.com/libeo-vtt/jquery-folder.git',
        Tab: 'https://github.com/libeo-vtt/jquery-tab.git',
        Form: 'https://github.com/libeo-vtt/jquery-form.git',
        AccessibleUpload: 'https://github.com/libeo-vtt/jquery-accessibleUpload.git',
        Slider: 'https://github.com/libeo-vtt/jquery-slider.git',
        Lightbox: 'https://github.com/libeo-vtt/jquery-lightbox.git',
        GoogleMap: 'https://github.com/libeo-vtt/jquery-map.git',
        Buttonize: 'https://github.com/libeo-vtt/jquery-buttonize.git',
        Focusable: 'https://github.com/libeo-vtt/jquery-focusable.git'
    };

    modules.forEach(function(module) {
        var output = exec('bower install ' + links[module] + ' --save');
        console.log(output.stdout);
        console.log('[Success] '.green + module + ' module installed');
    });

});
