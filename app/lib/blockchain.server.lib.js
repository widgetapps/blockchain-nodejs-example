'use strict';

const crypto = require('crypto');
const async  = require('async');
const request = require('request');

exports.newTransaction = function(app, sender, recipient, amount) {
    return newTransaction(app, sender, recipient, amount);
};

exports.getChain = function(app) {
    let chain = app.get('chain');

    return {
        'chain': chain,
        'length': chain.length
    };
};

exports.mine = function(app) {
    let lastBlock = getLastBlock(app);
    let lastProof = lastBlock.proof;
    let proof = proofOfWork(lastProof);
    let miner = app.get('miner');

    // credit the miner
    newTransaction(app, "0", miner, 1);

    // forge the new block
    let previousHash = hashBlock(lastBlock);
    let block = newBlock(app, proof, previousHash);

    // TODO: Save the miner in the block? Or maybe we can derive from the transaction sender of 0 (zero)
    return {
        'message': "New Block Forged",
        'index': block.index,
        'transactions': block.transactions,
        'proof': block.proof,
        'previous_hash': block.previous_hash
    };
};

exports.registerNodes = function(app, nodes) {
    nodes.forEach(function (node) {
        registerNode(app, node);
    });

    return {
        'message': 'New nodes have been added',
        'total_nodes': nodes.length
    };
};

exports.resolveConflicts = function(app, parentCallback) {
    let neighbours = app.get('nodes');
    let myChain = app.get('chain');
    let newChain = null;
    let maxLength = myChain.length;

    async.everySeries(neighbours, function (node, callback) {
        console.log(node);
        let url = 'http://' + node + '/chain';
        request(url, function (error, response, body) {
            if (response && response.statusCode === 200) {
                console.log('made it');
                let raw = JSON.parse(body);
                let length = raw.length;
                let chain = raw.chain;
                if (length > maxLength && validChain(chain)) {
                    maxLength = length;
                    newChain = chain;
                }
            }
            callback(null, true);
        });
    }, function (err, result) {
        let message = {
            'message': 'My chain rules them all.'
        };

        console.log('All nodes have been hit, about to send response...');
        if (err) {
            console.log('Error response');
            message = {
                'message': 'There was some kind of error getting consensus'
            };
        }

        if (newChain) {
            app.set('chain', newChain);

            console.log('Update chain response');
            message = {
                'message': 'Chain has been updated',
                'chain': newChain
            };
        }

        console.log('Main chain response');

        parentCallback(message);

    })

};

function registerNode(app, address) {
    let nodes = app.get('nodes');
    if (nodes.indexOf(address) < 0) nodes.push(address);
    console.log('New node list: ' + JSON.stringify(nodes));
    app.set('nodes', nodes);
}

function validChain(chain) {
    let lastBlock = chain[0];
    let currentIndex = 1;

    while (currentIndex < chain.length) {
        var block = chain[currentIndex];

        // Make sure the hash of teh block is correct
        if (block.previous_hash !== hashBlock(lastBlock)) {
            return false;
        }

        // Check the proof of work
        if (!validProof(lastBlock.proof, block.proof)) {
            return false;
        }

        lastBlock = block;

        currentIndex++;
    }

    console.log('Chain is valid');

    return true;
}

function newTransaction(app, sender, recipient, amount) {
    // TODO: Each transaction needs a signature using the private key of the sender. Signature must be sent by the client as the node doesn't have the private key. NEVER send the private key, only the transaction signature.
    let transactions = app.get('transactions');
    console.log('New Transaction');

    let transaction = {
        'sender': sender,
        'recipient': recipient,
        'amount': amount
    };

    console.log('Adding transaction: ' + JSON.stringify(transaction));

    transactions.push(transaction);
    console.log('Complete transactions: ' + JSON.stringify(transactions));

    app.set('transactions', transactions);

    return getLastBlock(app).index + 1;
}

function newBlock(app, proof, previousHash) {
    console.log('New Block');
    let chain = app.get('chain');
    let transactions = app.get('transactions');

    let block = {
        'index': chain.length + 1,
        'timestamp': new Date(),
        'transactions': transactions,
        'proof': proof,
        'previous_hash': previousHash
    };

    app.set('transactions', []);
    chain.push(block);
    app.set('chain', chain);
    return block;
}

function hashBlock(block) {
    console.log('Hash Block');

    let blockString = JSON.stringify(block, Object.keys(block).sort());
    console.log('Block String: ' + blockString);

    return crypto.createHash('sha256').update(Buffer.from(blockString)).digest('hex');
}

function getLastBlock(app) {
    console.log('Last Block');
    let chain = app.get('chain');

    return chain[chain.length - 1];
}

function proofOfWork(lastProof) {
    // TODO: Change the proof to nonce.
    let proof = 0;
    while (validProof(lastProof, proof) === false) {
        proof += 1;
    }

    return proof;
}

function validProof(lastProof, proof) {
    let guess = Buffer.from(lastProof.toString() + proof.toString());
    let guessHash = crypto.createHash('sha256').update(guess).digest('hex');

    return guessHash.substr(guessHash.length - 4) === '0000';
}