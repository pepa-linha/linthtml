var knife = require('../knife');

module.exports = {
    name: 'attr',
    description: 'A meta rule that emits attribute events',
    on: ['tag']
};

module.exports.lint = function(element, opts) {
    var subs = this.subscribers,
        as = element.attribs,
        issues = [];
    Object.keys(as).forEach(function(name) {
        var a = as[name]; a.name = name;
        var s = subs.filter(function(rule) {
            return !rule.trigger || rule.trigger.indexOf(name) > -1;
        });
        issues = issues.concat(knife.applyRules(s, a, opts));
    });
    return issues;
};