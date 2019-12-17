---
id: module-usage
title: Module usage
---

## Configuration

You can configure Migration with the `config` method. Defaults are:

```javascript
const migrator = require('@underbase/core');

migrator.config({
  // Log job run details to console
  logs: true,

  // Use a custom logger function (level, ...args) => void
  logger: (level, ...arg) => console.log(level, ...arg),

  // Enable/disable logging "Not migrating, already at version {number}"
  logIfLatest: true,

  // migrations collection name to use in the database
  collectionName: "migrations"

  // mongdb url or mongo Db instance
  db: "your connection string",
}); // Returns a promise
```

Use the migrator to configure and setup your migration.

Or, define a new instance of migration and configure it as you see fit :

```javascript
const { Migration } = require('@underbase/core');

const migrator = new Migration({
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

To run migrations until the latest version :

```javascript
await migrator.migrateTo('latest');
```

## Using ES6 syntax

You can also use Babel to use ES6+ syntax. See [Babel usage](babel-usage).

```js
import { migrator } from 'underbase';

const main = async () => {
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
      await MongoClient.collection('users')
        .rename('datecreated', 'dateCreated')
        .where({
          datecreated: {
            $exists: true,
          },
        });
    },
    down: async ({ MongoClient }) => {
      await MongoClient.collection('users')
        .rename('datecreated', 'dateCreated')
        .where({
          datecreated: {
            $exists: true,
          },
        });
    },
  });

  // Do something...
  await migrator.migrateTo(1.0);
})

main();
```

Executing this will create a migration named `Users` for collection `users` attached to the migration `1.0`.

When being run for the first time, this will create a MongoDB collection named `migrations` to store the current state of migrations.
