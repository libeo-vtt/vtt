var _ = require('lodash');
var config = require('../config.js');

function ExtendTwig(Twig, customTags) {
    if (!(this instanceof ExtendTwig)) return new ExtendTwig(Twig, customTags);
    this.extend(Twig, customTags);
}

ExtendTwig.prototype = {
    extend: function(Twig, customTags) {
        customTags.forEach(function(element) {
            if (_.has(Twig.logic.handler, element.name) === false) {
                Twig.exports.extendTag({
                    type: element.name,
                    regex: element.regex,
                    next: [],
                    open: true,
                    compile: function(token) {
                        var expression = token.match[1];

                        token.stack = Twig.expression.compile.apply(this, [{
                            type: Twig.expression.type.expression,
                            value: expression
                        }]).stack;

                        delete token.match;
                        return token;
                    },
                    parse: function(token, context, chain) {
                        var args = _.compact(_.map(token.stack, function(element){ return element.value; }));
                        return {
                            chain: false,
                            output: element.output(args)
                        };
                    }
                });
            }
        });
    }
};

module.exports = ExtendTwig;
