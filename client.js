'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Init the express application
var app = require('./config/express')();

// Initialize the arrays. The chain should come from some kind of DB eventually. For now, great the genesis block.
app.set('miner', process.env.MINER || 'WIDGETAPPS');
app.set('transactions', []);
app.set('chain', [{
    'index': 1,
    'timestamp': new Date(),
    'transactions': [],
    'proof': 100,
    'previous_hash': 1
}]);
app.set('nodes', ['104.198.238.183:3000','104.198.238.183:3001','104.198.238.183:3002','104.198.238.183:3003','104.198.238.183:3004','104.198.238.183:3005']);

// Start the app by listening on <port>
app.listen(config.port, config.ip);

// Expose app
var exports = module.exports = app;

// Logging initialization
console.log('GeeqChain node started on port ' + config.port + ' with IP ' + config.ip);