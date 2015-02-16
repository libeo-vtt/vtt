#!/usr/bin/env node

var program = require('commander');
var project = require('./package.json');

program
    .version(project.version)
    .command('helper [name]', 'install new helper')
    .command('init', 'initialize project')
    .command('module [name]', 'install new module')
    .parse(process.argv);
