#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var rm = require('rimraf');
var inquirer = require('inquirer');
var glob = require('glob');
var project = require('./package.json');

program
    .version(project.version)
    .parse(process.argv);

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// Initialisation prompt questions
var questions = [{
    name: 'name',
    message: 'Project name:',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid name.';
    }
}, {
    name: 'templates',
    type: 'confirm',
    message: 'Include VTT templates?',
    default: true
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
    default: 'http://127.0.0.1:3000'
}, {
    name: 'repository',
    message: 'Project git repository:'
}];

// Prompt user for project informations
inquirer.prompt(questions, function(answers) {
    // Update project values
    project.name = answers.name;
    project.version = answers.version;
    project.description = answers.description;
    project.keywords = answers.keywords;
    project.url = answers.url;
    project.repository = answers.repository;
    project.jsname = answers.jsname;
    project.templates = answers.templates;

    // Save new project values
    fs.writeFile('./package.json', JSON.stringify(project, null, 2), function(error) {
        if (error) return console.log(error);
    });

    // Save new project values
    glob('./src/js/**/*.js', function(error, files) {
        if (error) return console.log(error);

        for (var i = 0, t = files.length; i < t; i++) {
            (function(i) {
                var file = files[i];

                // Replace module name inside template file
                fs.readFile(file, 'utf8', function(error, data) {
                    if (error) return console.log(error);

                    data = replaceAll('PROJECT_NAME', answers.jsname, data);

                    fs.writeFile(file, data, 'utf8', function(error) {
                        if (error) return console.log(error);
                    });
                });
            })(i);
        }
    });

    // Remove templates files
    if (!answers.templates) {
        rm('./src/twig/templates/', function(error) {
            if (error) return console.log(error);
        });
        rm('./src/sass/templates.scss', function(error) {
            if (error) return console.log(error);
        });
    }
});
