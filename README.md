# thinky-loader
A general purpose model loader for Thinky ORM for RethinkDB. _See also migrating from sails-hook-thinky section below._ 

## Installation

`npm install thinky-loader`

or add to `package.json`

## Usage

This package configures the thinky orm and initializes the model files in the specified directory. Once configured any controllers or services can simply `require('thinky-loader')` to access instantiated thinky and model instances.

_In a controller, for example:_
```javascript
let orm = require('thinky-loader');

orm.models.Post.getJoin().then(function(posts) {
     console.log(posts);
 });

orm.models.Customer.orderBy({
    index: orm.thinky.r.desc("createdAt")
}).run().then(function(customers) {
     console.log(customers);
});
                  
```

## Configuration

It is recommended that you allocate a directory for your thinky model definitions, for example `data-models/thinky`. The loader will look in the specified directory and load each model definition.

_In a bootstapping or initialization file (could be your `app.js`!):_
```javascript
let orm = require('thinky-loader');

let ormConfig = {
                debug     : false, 
                modelsPath: 'data-models/thinky',
                thinky    : {
                        rethinkdb: {
                                host        : 'db-0',
                                port        : 28015,
                                authKey     : "",
                                db          : "master",
                                timeoutError: 5000,
                                buffer      : 5,
                                max         : 1000,
                                timeoutGb   : 60 * 60 * 1000
                        }
                }
        };

// returns a promise when configured
orm.initialize(ormConfig)
.then(() => console.log('Ready!'))
.catch(() => console.log('Darn!'));
```



## Model file configuration  
Create a file for each thinky model with the contents below. The model definition should mirror the same schema definition format you would normally use in thinky.

```javascript
module.exports = function()
{
    let thinky = this.thinky; // access to thinky instance
    let type   = this.thinky.type; // access to thinky type
    let models = this.models; // access to other models (for creating relationships)

    return {

        tableName: "Car",
        schema: {
            id: type.string(),
            type: type.string(),
            year: type.string(),
            idOwner: type.string()
        },
        options  : {
            enforce_extra: "none"
        },


        // set up any relationships, indexes or function definitions here
        init: function(model) {
            model.belongsTo(models.Person, "owner", "idOwner", "id"); // note the reference to another model `Person`
            
            model.ensureIndex("type");
            
            model.define("isDomestic", function() {
                return this.type === 'Ford' || this.type === 'GM';
            });
        }

    };
};
```
*Also see `examples` directory for sample model files.


## Migrating from [sails-hook-thinky](https://github.com/mwielbut/sails-hook-thinky)

This package configures the thinky orm and initializes the model files in the specified directory. 

Make model calls from any service, controller, policy, etc. just as you would normally. No need to require thinky or any model files.

```javascript
Post.getJoin().then(function(posts) {
     console.log(posts);
 });
```
