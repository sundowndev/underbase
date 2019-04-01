# Advanced

A more complete set of migrations might look like:

``` javascript
migrator.add({
  version: 1,
  name: 'Name for this migration',
  up: function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 1.
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
  down: function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 0
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  }
});

migrator.add({
  version: 2,
  name: 'Name for this migration',
  up: function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 2
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
  down: function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  }
});
```

Control execution flow with promises:

``` javascript
// using bluebird promise lib
import { Promise } from 'bluebird';

migrator.add({
  version: 1,
  name: 'Name for this migration',
  up: Promise.method(function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 1.
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
    return db.collections('someCollection')....
  }),
  down: Promise.method(function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 0
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
    return db.collections('someCollection')....
  })
});
```

Control execution flow with async/await:

``` javascript
migrator.add({
  version: 2,
  name: 'Name for this migration',
  up: async function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 2
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
     await db.collections('someCollection')....
  },
  down: async function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
    await db.collections('someCollection')....
  }
});
```