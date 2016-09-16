// node-sass-json-importer (custom implementation)
// based on https://github.com/Updater/node-sass-json-importer

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');
var _lodash2 = _interopRequireDefault(_lodash);
var _path = require('path');
var _isThere = require('is-there');
var _isThere2 = _interopRequireDefault(_isThere);
var _nodeSass = require('node-sass');
var _nodeSass2 = _interopRequireDefault(_nodeSass);

exports['default'] = function(url, prev) {
    if (!/\.json$/.test(url)) {
        return _nodeSass2['default'].NULL;
    }

    var includePaths = this.options.includePaths ? this.options.includePaths.split(':') : [];
    var paths = [].concat(prev.slice(0, prev.lastIndexOf('/'))).concat(includePaths);

    var file = paths.map(function(path) {
        return (0, _path.resolve)(path, url);
    }).filter(_isThere2['default']).pop();

    if (!file) {
        console.warn('Unable to find "' + url + '" from the following path(s): ' + paths.join(', ') + '.');
        var file = __dirname + '/json-fallback.json';
    }

    // Prevent file from being cached by Node's `require` on continuous builds.
    // https://github.com/Updater/node-sass-json-importer/issues/21
    delete require.cache[require.resolve(file)];

    return {
        contents: parseJSON(require(file))
    };
};

function parseJSON(json) {
    return Object.keys(json).map(function(key) {
        return '$' + key + ': ' + parseValue(json[key]) + ';';
    }).join('\n');
}

function parseValue(value) {
    if (_lodash2['default'].isArray(value)) {
        return parseList(value);
    } else if (_lodash2['default'].isPlainObject(value)) {
        return parseMap(value);
    } else {
        return value;
    }
}

function parseList(list) {
    return '(' + list.map(function(value) {
        return parseValue(value);
    }).join(',') + ')';
}

function parseMap(map) {
    return '(' + Object.keys(map).map(function(key) {
        return key + ': ' + parseValue(map[key]);
    }).join(',') + ')';
}
module.exports = exports['default'];
