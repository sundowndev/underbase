# Quick start

## CLI usage

First, install the cli app using npm or yarn.

It is recommended to install `underbase-cli` globally :

```bash
npm i underbase-cli -g
# or
yarn add underbase-cli
```

Verify installation :

```bash
underbase-cli --help
# or
./node_modules/underbase-cli/bin/cli.js --help
```

It should output this message :

```bash
Usage: underbase-cli <command> [OPTIONS]

Commands:
  underbase-cli migrate <migration>  Execute migrations
  underbase-cli list                 Show all migrations versions
  underbase-cli status               Show migrations status

Options:
  --version                 Show underbase-cli package version         [boolean]
  --db <url>                MongoDB connection URL
  --migrations-dir <dir>    Migrations versions directory
  --backups                 Enable automatic backups
  --backups-dir <dir>       Backups directory
  --collection-name <name>  Migrations state collection
  --logs                    Enable logs
  --force                   Force migrations execution
  --chdir <dir>             Change the working directory
  -h, --help                Show this help message                     [boolean]
```

Create your first migration : 

```
underbase-cli create 1.0
```

This will create a directory `migrations` and initialize the first version with a example migration.

It will also create a JSON configuration file `config.json`.

```
migrations
├── 1.0
│   ├── index.js
│   └── users.js
└── config.json
```

## Programatic usage

Install the Underbase library :

```bash
npm i underbase --save-dev
```

#### Basics

Import and use the migration instance - migrator. User the migrator to configure and setup your migration

``` javascript
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
      db: "your connection string",
}); // Returns a promise
```

Or ...

Define a new instance of migration and configure it as you see fit

``` javascript
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
      db: "your connection string",
})
await migrator.config(); // Returns a promise
```

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

We used ES6 to write examples but you can also write migrations in CommonJS :

##### CommonJS

```js
const { migrator } = require('underbase');

migrator.config({
  // migrations collection name. Defaults to 'migrations'
  collectionName: 'migrations',
  // mongdb url or mongo Db instance
  db: "mongodb://localhost:27017/underbase",
})
  .then(function() {
    migrator.add({ ... });
  })
  .then(function() {
    // ... do something
    // migrator.migrateTo(1.0);
  })
```

##### ES6

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
    name: 'Users',
    up: (db) => {
      db.collection('users')
        .updateMany(
          {},
          {
            $rename: { username: 'name' },
          }, { multi: true }
        );
    },
    down: (db) => {
      db.collection('users')
        .updateMany(
          {},
          {
            $rename: { name: 'username' },
          }, { multi: true }
        );
    }
  });

  // ... do something
  // migrator.migrateTo(1.0);
})();
```

Executing this will create a migration named `Users` for collection "users" attached to the version `1.0`.

This will create a MongoDB collection named "migrations" to store the current state of migrations.

**IMPORTANT**:
- You cannot create your own migration at version 0. This version is reserved by migration for
a 'vanilla' system, that is, one without any migrations applied.
- If migrating from vT1 to vTz and migration fails from a vTx to vTy, where vTx & vTy are incremental versions
between vT1 to vTz, migration will stop at vTx.
- Prefer an async function (async | promise) for both up()/down() setup. This will ensure migration completes before version bump during execution.

Next, learn how to [configure](/configuration) underbase.