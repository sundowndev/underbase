---
id: api-config
title: Configuration API
---

Those configuration options are both used by the CLI app and the module.

## Reference

### `config`

Configuration file path.

- Default : `'underbase.config.js'`
- Type : `string`

```shell
underbase --config underbase.config.js
```

### `db`

MongoDB connection URL.

- Default : `''`
- Type : `string`

```shell
underbase --db mongodb://localhost:27017/underbase_example
```

### `migrationsDir`

Migrations versions directory. Should be used with an absolute path.

- Default : `'./migrations'`
- Type : `string`

```shell
underbase --migrationsDir ./migrations
```

### `collectionName`

Migrations state collection.

- Default : `'migrations'`
- Type : `string`

```shell
underbase --collectionName migrations
```

### `logs`

Enable logs.

- Default : `true`
- Type : `boolean`

```shell
underbase --logs true
```

### `logIfLatest`

Log in the terminal if you are already at the specified version.

- Default : `true`
- Type : `boolean`

```shell
underbase --logIfLatest true
```

### `supportFile`

Support file path.

- Default : `undefined`
- Type : `string`

```shell
underbase --supportFile ./support.js
```
