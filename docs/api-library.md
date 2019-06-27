---
id: api
title: Module
---

The following API reference describes the public methods exposed by the Underbase library.

## Reference

### `migrateTo()`

Migrate to a given version. The parameter can be a number or a string

```javascript
// Declaration : async migrateTo(command: string | number): Promise<void>
// returns a promise
migrator.migrateTo(2); // migrate to version 2 or 2.0
migrator.migrateTo('latest'); // migrate to the latest version
migrator.migrateTo('3,rerun'); // migrate to version 3 and force execution
```

### `getVersion()`

See what version the database is at.

```javascript
// Declaration : async getVersion(): Promise<number>
// returns a number in a promise
migrator.getVersion();

// Example :
const version = await migrator.getVersion();
console.log(version); // this will return 1
```

### `getNumberOfMigrations()`

See what number of migrations configured.

```javascript
// Declaration : getNumberOfMigrations(): number
// returns a number
migrator.getNumberOfMigrations();
```

### `getMigrations()`

Get configured migrations.

```javascript
// Declaration : getMigrations(): any[]
// returns an array
migrator.getMigrations();
```

### `getConfig()`

Get configuration object.

```javascript
// Declaration : getConfig(): IMigrationOptions
// returns an object
migrator.getConfig();
```

### `unlock()`

Unlock migration control.

```javascript
// Declaration : unlock(): void
migrator.unlock();
// Is the same as :
// db.migrations.update({_id:"control"}, {$set:{"locked":false}});
```

### `isLocked()`

Indicate if the migration state is locked or not.

```javascript
// Declaration : async isLocked(): Promise<boolean>
// returns a promise
if (await migrator.isLocked()) {
  /* ... */
}

// or...

migrator.isLocked().then(locked => {
  if (locked) {
    /* ... */
  }
});
```

### `reset()`

Reset migration configuration. This is intended for dev and test mode only. Use wisely.

```javascript
// Declaration : async reset(): Promise<void>
// returns a promise
migrator.reset();
```

### `config()`

Configure migration.

```javascript
// Declaration : async config(opts?: IMigrationOptions): Promise<void>
// returns a promise
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

### `add()`

Register a new migration.

```javascript
// Declaration : add(migration: IMigration): void
// returns a promise
migrator.add({
  version: 1,
  up: async ({ MongoClient }) => {
    // use `db`(mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
  down: async ({ MongoClient }) => {
    // use `db`(mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
});
```
