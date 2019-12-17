---
id: logging
title: Logging
---

## Inside migrations

The library passes multiple objects to migrations functions. One of them make you able to send output messages to the CLI.

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

Which will produce the following :

```
$ underbase migrate 1

 INFO  Connecting to MongoDB...
 INFO  Migrating from version 0 -> 1

 Running down() on version 1
     Name for this migration
     LOGGER Hello world!

 SUCCESS  Finished migrating.

✦ Time spent: 0.995 sec
```

## Using module

Migrations uses console by default for logging if not provided. If you want to use your own logger (for sending to other consumers or similar) you can do so by configuring the `logger` option when calling `migrator.config`.

Migrations expects a function as `logger`, and will pass arguments to it for you to take action on.

```js
const MyLogger = {
  log: (...args) => console.log('<log>', ...args),
  error: (...args) => console.log('<error>', ...args),
  warn: (...args) => console.log('<warn>', ...args),
  info: (...args) => console.log('<info>', ...args),
  success: (...args) => console.log('<success>', ...args),
};

Migrations.config({
  ...
  logger: MyLogger
  ...
});
```

Your logger will then be called like so :

```js
MyLogger.warn('Beware! Up function is not async!');
```
