/**
 * Author.js
 *
 * @description :: Example of a blog post author model file.
 */

module.exports = function()
{
    let thinky = this.thinky;
    let type   = this.thinky.type;
    let models = this.models;

    return {

	    tableName: "Author", 
	    schema: {
	        id: type.string(),
	        sold: type.number(),
	        userId: type.string()
	    },
	    options: {},


	    // set up any relationships, indexes or function definitions here
	    init: function(model) {}

    };
};