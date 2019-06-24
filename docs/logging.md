---
id: logging
title: Logging
---

## Inside migrations

The library passes multiple objects to migrations functions. One of them make you able to use the library's logger.

```js
{
  version: 1.0,
  describe: 'Name for this migration',
  up: async ({ MongoClient, Query, Migrate, Logger }) => {
    Logger('Hello world!')
  },
  down: async ({ MongoClient, Query, Migrate, Logger }) => {},
}
```

You can use it as follow :

```js
// Logger(level: SyslogLevels, logs: string)
Logger('Hello world!');
Logger('info', 'Hello world!');
```

The `SyslogLevels` type is designed as described below :

```typescript
type SyslogLevels =
  | 'debug'
  | 'info'
  | 'notice'
  | 'warning'
  | 'error'
  | 'crit'
  | 'alert';
```

## Using module

Migrations uses console by default for logging if not provided. If you want to use your
own logger (for sending to other consumers or similar) you can do so by
configuring the `logger` option when calling `migrator.config` .

Migrations expects a function as `logger`, and will pass an argument with properties level, message,
to it for
you to take action on.

```js
const MyLogger = function(level, message) {
  console.log('Level', level);
  console.log('Message', message);
}

Migrations.config({
  ...
  logger: MyLogger
  ...
});
```

The arguments passed to `MyLogger` above includes `level` and `message`.

- `level` will be a string, one of `debug`, `info`, `notice`, `warning`, `error`, `crit`, or `alert`.
- `message` is a string, like `Finished migrating.`.

Example :

```js
MyLogger('warning', 'Beware! Up function is not async!');
```
