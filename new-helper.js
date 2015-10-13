#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var inquirer = require('inquirer');
var project = require('./package.json');
var config = require('./gulp/config.js');

program
    .version(project.version)
    .option('-n, --name <name>', 'helper name')
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

// Helper prompt questions
var questions = [{
    name: 'name',
    message: 'Helper name:',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid name.';
    }
}];

// Prompt user for project informations
inquirer.prompt(questions, function(answers) {
    var helperTemplateFile = './.templates/helper.js',
        helperNewFile = './src/js/helpers/' + answers.name + '.js';

    fs.exists(helperNewFile, function(exists) {
        if (exists) {
            // File already exist, exit
            console.log('Error: '.red + answers.name + ' helper already exists in ./src/js/helpers.');
        } else {
            // Copy template file
            fs.createReadStream(helperTemplateFile).pipe(fs.createWriteStream(helperNewFile));

            // Replace helper name inside template file
            fs.readFile(helperNewFile, 'utf8', function(error, data) {
                if (error) return console.log(error);

                data = replaceAll('{{HEADER}}', header(answers.name), data);
                data = replaceAll('{{HELPER_NAME_LOWERCASE}}', lowercase(answers.name), data);
                data = replaceAll('{{HELPER_NAME}}', camelcase(answers.name), data);

                fs.writeFile(helperNewFile, data, 'utf8', function(error) {
                    if (error) return console.log(error);
                });
            });

            // Append new helper to ./src/js/helpers/index.js
            fs.appendFile('./src/js/helpers/index.js', 'exports.' + answers.name + ' = require(\'./' + answers.name + '\');\n', function(error) {
                if (error) return console.log(error);
            });

            // Confirmation message
            console.log('Success: '.green + answers.name + ' javascript helper successfully created in ./src/js/helpers.');
        }
    });
});
