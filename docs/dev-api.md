# Developer API

This documentation is intended for developers who want to contribute to Underbase. All of the above properties and methods are private.

## Properties

- [defaultMigration](#defaultMigration)
- [_list](#_list)
- [_collection](#_collection)
- [_db](#_db)
- [options](#options)

## Methods

- [execute()](#execute)
- [getControl](#getControl)
- [setControl](#setControl)
- [findIndexByVersion](#findIndexByVersion)

----

## Reference

#### Properties

### `defaultMigration`

The default state of migrations. Used as version 0.

### `_list`

List of registered migrations.

### `_collection`

The migration collection MongoDB object.

### `_db`

The MongoDB database instance.

### `options`

Configuration object.

#### Methods

### `execute()`

Migrate to the specific version passed in.

``` javascript
// Declaration : async execute(version: string | number, rerun?: boolean): Promise<void>
// return a promise
if (version === 'latest') {
  await this.execute(_.last<any>(this._list).version);
} else {
  await this.execute(parseFloat(version as string), (subcommand === 'rerun'));
}
```

### `getControl()`

Gets the current control record, optionally creating it if non-existant.

``` javascript
// Declaration : async getControl(): Promise<{ version: number, locked: boolean }>
// returns a promise
```

### `setControl()`

Set the control record.

``` javascript
// Declaration : async setControl(control: { version: number, locked: boolean }): Promise<{ version: number, locked: boolean } | null>
// returns a promise
```

### `findIndexByVersion()`

Returns the migration index in _list or throws if not found.

``` javascript
// Declaration : findIndexByVersion(version: string | number): number
// returns a number
```