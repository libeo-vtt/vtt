#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var rm = require('rimraf');
var inquirer = require('inquirer');
var glob = require('glob');
var colors = require('colors');
var cmd = require('node-cmd');
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
        'AccessibleUpload',
        'Slider',
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
        Folder: 'git@github.com:libeo-vtt/jquery-folder.git',
        Tab: 'git@github.com:libeo-vtt/jquery-tab.git',
        Form: 'git@github.com:libeo-vtt/jquery-form.git',
        AccessibleUpload: 'git@github.com:libeo-vtt/jquery-accessibleUpload.git',
        Slider: 'git@github.com:libeo-vtt/jquery-slider.git',
        Buttonize: 'git@github.com:libeo-vtt/jquery-buttonize.git',
        Focusable: 'git@github.com:libeo-vtt/jquery-focusable.git'
    };

    modules.forEach(function(module) {
        cmd.get('bower install ' + links[module] + ' --save', function(data) {
            console.log(data);
            console.log('[Success] '.green + module + ' module installed\n');
        });
    });

});
