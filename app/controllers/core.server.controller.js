'use strict';

var blockchain = require('../lib/blockchain.server.lib');

exports.index = function(req, res) {
    res.json({message: 'Hi there, I\'m a GeeqChain node. Isn\'t that weird?'});
};

exports.newTransaction = function (req, res) {
    var index = blockchain.newTransaction(req.app, req.body.sender, req.body.recipient, req.body.amount);
    res.json({
        message: 'Transaction will be added to Block ' + index
    });
};

exports.getChain = function (req, res) {
    res.json(blockchain.getChain(req.app));
};

exports.mine = function (req, res) {
    res.json(blockchain.mine(req.app));
};

exports.registerNodes = function (req, res) {
    res.json(blockchain.registerNodes(req.app, req.body.nodes));
};

exports.consensus = function (req, res) {
    blockchain.resolveConflicts(req.app, function(message) {
        res.json(message);
    });
};


