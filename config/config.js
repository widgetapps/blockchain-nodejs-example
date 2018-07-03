'use strict';

/**
 * Module dependencies.
 */
let _ = require('lodash'),
    glob = require('glob');

module.exports = {
    app: {
        title: 'blockchain-nodejs-example',
        description: 'A simple blockchain implemented in NodeJS',
        keywords: 'Express, Node.js'
    },
    port: process.env.PORT || 3101,
    ip: process.env.IP || '127.0.0.1'
};

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
    // For context switching
    let _this = this;

    // URL paths regex
    let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            let files = glob(globPatterns, { sync: true });
            if (removeRoot) {
                files = files.map(function(file) {
                    return file.replace(removeRoot, '');
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};