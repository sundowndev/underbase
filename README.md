A simple migration system for mongodb supporting up/downwards migrations. Migration is a fork and
heavily refeactored version of [percolatestudio/meteor-migrations](https://github.com/percolatestudio/meteor-migrations) to make a generic mongodb
migration library

## Installation

Migrations can be installed through yarn or npm. Type:

``` sh
$ yarn add ebuah:migration
```

## API

### Basics

Import and use the migration instance - migrator

``` javascript
import { migrator } from 'migration';
```

User the migrator to configure and setup your migration or define a new instance of migration

``` javascript
import { Migration } from 'migration';
var migrator = new Migration({{
      // false disables logging
      log: true,
      // null or a function
      logger: (level, ..arg) => console.log(level, ..arg),
      // enable/disable info log "already at latest."
      logIfLatest: true,
      // migrations collection name
      collectionName: 'migrations',
      // mongdb url
      dbUrl: null,
}})
```

To write a simple migration, somewhere in the server section of your project define:

``` javascript
migrator.add({
  version: 1,
  up: function() {
    //code to migrate up to version 1
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
  name: 'Adds pants to some people in the db.',
  up: function() { // code to migrate up to version 1 }
  down: function() { // code to migrate down to version 0 }
});

migrator.add({
  version: 2,
  name: 'Adds a hat to all people in the db who are wearing pants.',
  up: function() { // code to migrate up to version 2 }
  down: function() { // code to migrate down to version 1 }
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

**NOTE**: You cannot create your own migration at version 0. This version is reserved by migration for a 'vanilla' system, that is, one without any migrations applied.

To see what version the database is at, call:

``` javascript
migrator.getVersion();
```

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
});
```


## Test

Run test

``` sh
$ yarn test
```


