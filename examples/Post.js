/**
 * Post.js
 *
 * @description :: Example of a blog post model file.
 */


module.exports = function()
{
    let thinky = this.thinky;
    let type   = this.thinky.type;
    let models = this.models;

    return {

        tableName: "Post",
        schema: {
            id: type.string(),
            title: type.string(),
            content: type.string(),
            idAuthor: type.string()
        },


        // set up any relationships, indexes or function definitions here
        init: function(model) {
            model.belongsTo(models.Author, "author", "idAuthor", "id");
        }

    };
};