---
id: module-usage
title: Module usage
---

## Configuration

You can configure Migration with the `config` method. Defaults are:

``` javascript
migrator.config({
  // Log job run details to console
  logs: true,
  // Use a custom logger function (level, ...args) => void
  logger: null,
  // Enable/disable logging "Not migrating, already at version {number}"
  logIfLatest: true,
  // migrations collection name to use in the database
  collectionName: "migrations"
  // mongdb url or mongo Db instance
  db: "your connection string",
});
```

## Basics

Import and use the migration instance - migrator. User the migrator to configure and setup your migration

```javascript
import { migrator } from 'underbase';

migrator.config({
  // false disables logging
  logs: true,
  // null or a function
  logger: (level, ...arg) => console.log(level, ...arg),
  // enable/disable info log "already at latest."
  logIfLatest: true,
  // migrations collection name. Defaults to 'migrations'
  collectionName: 'migrations',
  // mongdb url or mongo Db instance
  db: 'your connection string',
}); // Returns a promise
```

Or ...

Define a new instance of migration and configure it as you see fit

```javascript
import { Migration } from 'underbase';

var migrator = new Migration({
  // false disables logging
  logs: true,
  // null or a function
  logger: (level, ...arg) => console.log(level, ...arg),
  // enable/disable info log "already at latest."
  logIfLatest: true,
  // migrations collection name
  collectionName: 'migrations',
  // mongdb url or mongo Db instance
  db: 'your connection string',
});
await migrator.config(); // Returns a promise
```

To write a simple migration, somewhere in the server section of your project define:

```javascript
migrator.add({
  version: 1, // Implicit 1.0, we recommand always use float for this field
  up: function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient` (mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
});
```

To run this migration to the latest version:

```javascript
migrator.migrateTo('latest');
```

We used ES6 to write examples but you can also write migrations in CommonJS :

## Using CommonJS

```js
const { migrator } = require('underbase');

migrator
  .config({
    // migrations collection name. Defaults to 'migrations'
    collectionName: 'migrations',
    // mongdb url or mongo Db instance
    db: 'mongodb://localhost:27017/underbase',
  })
  .then(function() {
    migrator.add({
      /* ... */
    });
  })
  .then(function() {
    // ... do something
    // migrator.migrateTo(1.0);
  });
```

## Using ES6

**Note:** using the CLI app will automatically execute migrations files as ES6 modules. You don't need babel.

```js
import { migrator } from 'underbase';

(async () => {
  await migrator.config({
    // migrations collection name. Defaults to 'migrations'
    collectionName: 'migrations',
    // mongdb url or mongo Db instance
    db: 'mongodb://localhost:27017/underbase',
  });

  migrator.add({
    version: 1.0,
    describe: 'Users',
    up: async ({ MongoClient }) => {
      await MongoClient.collection('users').updateMany(
        {},
        {
          $rename: { username: 'name' },
        },
        { multi: true },
      );
    },
    down: async ({ MongoClient }) => {
      await MongoClient.collection('users').updateMany(
        {},
        {
          $rename: { name: 'username' },
        },
        { multi: true },
      );
    },
  });

  // ... do something
  // migrator.migrateTo(1.0);
})();
```

Executing this will create a migration named `Users` for collection "users" attached to the version `1.0`.

This will create a MongoDB collection named "migrations" to store the current state of migrations.