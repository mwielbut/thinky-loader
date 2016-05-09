/**
 * ExampleController
 *
 * @description :: Example controller to demonstrate calling thinky model.
 */

let orm = require('thinky-loader');

module.exports = {


    'test': function(req, res) {
        orm.models.Post.getJoin().then(function(result) {
            res.json(result);
        });

    },

};


