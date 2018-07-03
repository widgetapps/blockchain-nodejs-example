'use strict';

/**
 * Module dependencies.
 */
let config = require('./config/config');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Init the express application
let app = require('./config/express')();

let port = config.port;

// Check to see if args came in from CLI. If so, use them as the port.
if (Number.isInteger(process.argv[2]) && process.argv[2] > 1024 && process.argv[2] < 65535) {
    port = process.argv[2];
}

// Initialize the arrays. The chain should come from some kind of DB eventually. For now, create the genesis block.
app.set('miner', process.env.MINER || 'DEFAULT MINER');
app.set('transactions', []);
app.set('chain', [{
    'index': 1,
    'timestamp': new Date(),
    'transactions': [],
    'proof': 100,
    'previous_hash': 1
}]);
app.set('nodes', ['127.0.0.1:3000','127.0.0.1:3001','127.0.0.1:3002']);

// Start the app by listening on <port>
app.listen(config.port, config.ip);

// Expose app
let exports = module.exports = app;

// Logging initialization
console.log('ExampleChain node started on port ' + config.port + ' with IP ' + config.ip);