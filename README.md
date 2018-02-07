A simple migration system for mongodb supporting up/downwards migrations.

## Installation

Migrations can be installed through yarn or npm. Type:

``` sh
$ npm install mgdb-migrator
```
or
``` sh
$ yarn add mgdb-migrator
```

## API

### Basics

Import and use the migration instance - migrator. User the migrator to configure and setup your migration

``` javascript
import { migrator } from 'migration';

migrator.config({
      // false disables logging
      log: true,
      // null or a function
      logger: (level, ..arg) => console.log(level, ..arg),
      // enable/disable info log "already at latest."
      logIfLatest: true,
      // migrations collection name
      collectionName: 'migrations',
      // mongdb url or mongo Db instance
      db: "your connection string",
}); // Returns a promise

```

Or ...

Define a new instance of migration and configure it as you see fit

``` javascript
import { Migration } from 'migration';

var migrator = new Migration({
      // false disables logging
      log: true,
      // null or a function
      logger: (level, ..arg) => console.log(level, ..arg),
      // enable/disable info log "already at latest."
      logIfLatest: true,
      // migrations collection name
      collectionName: 'migrations',
      // mongdb url or mongo Db instance
      db: "your connection string",
})
await migrator.config(); // Returns a promise
```

If mi

To write a simple migration, somewhere in the server section of your project define:

``` javascript
migrator.add({
  version: 1,
  up: function(db) {
    // use `db`(mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  }
});
```

To run this migration to the latest version:

``` javascript
migrator.migrateTo('latest');
```

### Advanced

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

As in 'Basics', you can migrate to the latest by running:

``` javascript
migrator.migrateTo('latest');
```

By specifying a version, you can migrate directly to that version (if possible). The migration system will automatically determine which direction to migrate in.

In the above example, you could migrate directly to version 2 by running:

``` javascript
migrator.migrateTo(2);
```

If you wanted to undo all of your migrations, you could migrate back down to version 0 by running:

``` javascript
migrator.migrateTo(0);
```

Sometimes (usually when somethings gone awry), you may need to re-run a migration. You can do this with the rerun subcommand, like:

``` javascript
migrator.migrateTo('3,rerun');
```

To see what version the database is at, call:

``` javascript
migrator.getVersion();
```

To see what number of migrations configured, call:

``` javascript
migrator.getNumberOfMigrations();
```

**IMPORTANT**:
- You cannot create your own migration at version 0. This version is reserved by migration for
a 'vanilla' system, that is, one without any migrations applied.
- If migrating from vT1 to vTz and migration fails from a vTx to vTy, where vTx & vTy are incremental versions
between vT1 to vTz, migration will stop at vTx.
- Prefer an async function ( async | promise) for both up()/down() setup. This will ensure migration completes before version bump during execution.

### Configuration

You can configure Migration with the `config` method. Defaults are:

``` javascript
migrator.config({
  // Log job run details to console
  log: true,
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



## Development

Run docker-compose to execute lib in dev mode

``` sh
$ npm run docker:dev
```

## Test

Run docker-compose to execute lib in test mode

``` sh
$ npm run docker:test
```

## Credits
Migration builds on [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations) with the goal of creating a generic mongodb migration library
