#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var inquirer = require('inquirer');
var colors = require('colors');
var project = require('./package.json');
var config = require('./gulp/config.js');

program
    .version(project.version)
    .option('-n, --name <name>', 'module name')
    .parse(process.argv);

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function camelcase(string) {
    return (string || '').toLowerCase().replace(/(\b|-)\w/g, function(match) {
        return match.toUpperCase().replace(/-/, '');
    });
}

function lowercase(string) {
    return (string || '').toLowerCase().replace(/(\b|-)\w/g, function(match) {
        return match.toLowerCase().replace(/-/, '');
    });
}

function header(name) {
    var output = '',
        line = Array(name.length + 1).join('-');

    output += '// ------------------------' + line + ' //\n';
    output += '//             ' + camelcase(name) + '             //\n';
    output += '// ------------------------' + line + ' //';

    return output;
}

// Module prompt questions
var questions = [{
    name: 'name',
    message: 'Module name:',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid name.';
    }
}, {
    name: 'description',
    message: 'Module description:',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid description.';
    }
}, {
    name: 'js',
    type: 'confirm',
    message: 'Create javascript module?',
    default: true
}, {
    name: 'sass',
    type: 'confirm',
    message: 'Create sass module?',
    default: true
}];

// Prompt user for project informations
inquirer.prompt(questions, function(answers) {
    if (answers.js) {
        var jsTemplateFile = './.templates/module.js',
            jsNewFile = './src/js/modules/jquery.' + answers.name + '.js';

        fs.exists(jsNewFile, function(exists) {
            if (exists) {
                // File already exist, exit
                console.log('Error: '.red + answers.name + ' module already exists in ./src/js/modules.');
            } else {
                // Copy template file
                fs.createReadStream(jsTemplateFile).pipe(fs.createWriteStream(jsNewFile));

                // Replace module name inside template file
                fs.readFile(jsNewFile, 'utf8', function(error, data) {
                    if (error) return console.log(error);

                    data = replaceAll('MODULENAME_LOWERCASE', lowercase(answers.name), data);
                    data = replaceAll('MODULENAME_UPPERCASE', camelcase(answers.name), data);
                    data = replaceAll('MODULE_DESCRIPTION', answers.description, data);

                    fs.writeFile(jsNewFile, data, 'utf8', function(error) {
                        if (error) return console.log(error);
                    });
                });

                // Confirmation message
                console.log('Success: '.green + answers.name + ' javascript module successfully created in ./src/js/modules.');
            }
        });
    }

    if (answers.sass) {
        var sassTemplateFile = './.templates/module.scss',
            sassNewFile = './src/sass/modules/_' + answers.name + '.scss';

        fs.exists(sassNewFile, function(exists) {
            if (exists) {
                // File already exist, exit
                console.log('Error: '.red + answers.name + ' module already exists in ./src/sass/modules.');
            } else {
                // Copy template file
                fs.createReadStream(sassTemplateFile).pipe(fs.createWriteStream(sassNewFile));

                // Replace module name inside template file
                fs.readFile(sassNewFile, 'utf8', function(error, data) {
                    if (error) return console.log(error);

                    data = replaceAll('HEADER', header(answers.name), data);
                    data = replaceAll('MODULENAME_LOWERCASE', lowercase(answers.name), data);
                    data = replaceAll('MODULENAME_UPPERCASE', camelcase(answers.name), data);

                    fs.writeFile(sassNewFile, data, 'utf8', function(error) {
                        if (error) return console.log(error);
                    });
                });

                // Confirmation message
                console.log('Success: '.green + answers.name + ' sass module successfully created in ./src/sass/modules.');
            }
        });
    }
});
