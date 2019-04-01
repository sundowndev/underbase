# API

## `migrateTo`

Migrate to a given version. The parameter can be a number or a string

```javascript
// migrator.migrateTo(version: string | number);
migrator.migrateTo(2); // migrate to version 2 or 2.0
migrator.migrateTo('latest'); // migrate to the latest version
migrator.migrateTo('3,rerun'); // migrate to version 3 and force execution
// return a promise
```

## `getVersion`

See what version the database is at.

```javascript
migrator.getVersion();
// returns an integer
```

## `getNumberOfMigrations`

See what number of migrations configured.

```javascript
migrator.getNumberOfMigrations();
// returns an integer
```

# To do

## `getMigrations`

Get configured migrations.

```javascript
migrator.getMigrations();
// returns an array
```

## `getConfig`

Get configuration object.

```javascript
migrator.getConfig();
// returns an object
```