# thinky-loader
A general purpose model loader for Thinky ORM for RethinkDB. _See also migrating from sails-hook-thinky section below._ 

## Why

Rethinkdb is awesome and Thinky is a great ORM for it. But loading multiple model definition files and making them available in a large distributed Node.js applicaiton could be better. 

## Installation

`npm install thinky-loader`

or add to `package.json`

*Also make sure to include `thinky` in your package.json as the loader does not make any assumptions as to the version of thinky you're using.

## Usage

`thinky-loader` configures the thinky orm and initializes the model files in the specified directory. Once initialized any controllers or services in your app can simply `require('thinky-loader')` to access instantiated thinky and model instances. It's basically just a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) for thinky.

_In a controller, for example:_
```javascript
let orm = require('thinky-loader');

// Post has been loaded and can be referenced at orm.models
orm.models.Post.getJoin().then(function(posts) {
     console.log(posts);
 });

// Customer has been loaded and can be referenced at orm.models
// The instance of thinky is available at orm.thinky
orm.models.Customer.orderBy({
    index: orm.thinky.r.desc("createdAt")
}).run().then(function(customers) {
     console.log(customers);
});
                  
```

## Configuration

It is recommended that you carve out a directory for your thinky model definitions, for example `data-models/thinky` and keep each model in a separate file. The loader will look in the specified directory and load each model definition.

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
orm.initialize(ormConfig) // you can also optionally pass an instance of thinky: [orm.initialize(ormConfig, thinky)] for additional configuration.
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

`thinky-loader` is the recommended replacement for `sails-hook-thinky`. It provides a standard loader for Sailsjs and non-Sailsjs projects and removes the use of global variables the are common within Sailsjs.

Anyone using sails-hook-thinky can perform the following steps to migrate over:

1. Remove `sails-hook-thinky` and add `thinky-loader` in your `package.json`
2. Make sure `thinky` is in your `package.json`
3. Update your thinky configuration with the example configuration above
4. Add `orm.initialize(ormConfig)` to your `bootstrap.js` file. This loader will no longer load automatically on startup like a hook. This is really for the best...
5. Update your model definition files to the new format
6. Models and thinky are no longer available as global variabels. You'll need to add `let orm = require('thinky-loader');` to any file the requires orm access and reference your model instances directly via `orm.models.<NAME>`.
