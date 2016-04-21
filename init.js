#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var rm = require('rimraf');
var inquirer = require('inquirer');
var glob = require('glob');
var package = require('./package.json');
var bower = require('./bower.json');

program
    .version(package.version)
    .parse(process.argv);

// Initialisation prompt questions
var questions = [{
    name: 'name',
    message: 'Project name:',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid name.';
    }
}, {
    name: 'version',
    message: 'Project version:',
    default: '0.0.1',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid version.';
    }
}, {
    name: 'description',
    message: 'Project description:'
}, {
    name: 'keywords',
    message: 'Project keywords:'
}, {
    name: 'url',
    message: 'Project url:',
    default: 'http://localhost:3000'
}, {
    name: 'repository',
    message: 'Project git repository:'
}, {
    name: 'browsers',
    type: 'checkbox',
    message: 'Browser support:',
    choices: [{
        value: 'Internet Explorer 8',
        checked: false
    }, {
        value: 'Internet Explorer 9',
        checked: true
    }, {
        value: 'Internet Explorer 10',
        checked: true
    }, {
        value: 'Internet Explorer 11',
        checked: true
    }, {
        value: 'Microsoft Edge',
        checked: true
    }, {
        value: 'Google Chrome (dernière version)',
        checked: true
    }, {
        value: 'Firefox (dernière version)',
        checked: true
    }, {
        value: 'Safari (dernière version)',
        checked: true
    }]
}, {
    name: 'responsive',
    type: 'confirm',
    message: 'Responsive?',
    default: true
}, {
    name: 'accessible',
    type: 'confirm',
    message: 'Accessible?',
    default: true
}, {
    name: 'templates',
    type: 'confirm',
    message: 'Include VTT templates?',
    default: true
}];

// Prompt user for project informations
inquirer.prompt(questions, function(answers) {

    // Update package.json values
    package.name = answers.name;
    package.version = answers.version;
    package.description = answers.description;
    package.keywords = answers.keywords;
    package.url = answers.url;
    package.repository = answers.repository;

    // Update bower.json values
    bower.name = answers.name;
    bower.version = answers.version;
    bower.description = answers.description;
    bower.homepage = answers.url;

    // Save new package.json values
    fs.writeFile('./package.json', JSON.stringify(package, null, 2), function(error) {
        if (error) return console.log(error);
    });

    // Save new project values
    fs.writeFile('./bower.json', JSON.stringify(bower, null, 2), function(error) {
        if (error) return console.log(error);
    });

    // Remove templates files
    if (!answers.templates) {
        rm('./src/templates/', function(error) {
            if (error) return console.log(error);
        });
    }
});
