'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('../../app/controllers/core.server.controller');
    app.route('/').get(core.index);

    app.route('/transactions/new').post(core.newTransaction);
    app.route('/chain').get(core.getChain);
    app.route('/mine').get(core.mine);
    app.route('/nodes/register').post(core.registerNodes);
    app.route('/consensus').get(core.consensus);
};