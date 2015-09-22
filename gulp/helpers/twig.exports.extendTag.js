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
                    next: element.next === undefined ? [] : element.next,
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
                        var args = _.compact(_.map(token.stack, function(element) {
                            return element.value;
                        }));
                        return {
                            chain: false,
                            //=output: element.next === undefined ? element.output(args) : Twig.parse.apply(this, [token.output, context])
                            output: element.output(token.output !== undefined ? [token.output[0].value, args] : args)
                        };
                    }
                });
                if (element.next !== undefined) {
                    Twig.exports.extendTag({
                        type: element.next[0],
                        regex: new RegExp('^' + element.next[0] + '$'),
                        next: [],
                        open: false
                    });
                }
            }
        });
    }
};

module.exports = ExtendTwig;
