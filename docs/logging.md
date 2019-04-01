# Logging

Migrations uses console by default for logging if not provided. If you want to use your
own logger (for sending to other consumers or similar) you can do so by
configuring the `logger` option when calling `migrator.config` .

Migrations expects a function as `logger`, and will pass an argument with properties level, message,
 to it for
you to take action on.

``` javascript
var MyLogger = function(opts) {
  console.log('Level', opts.level);
  console.log('Message', opts.message);
}

Migrations.config({
  ...
  logger: MyLogger
  ...
});
```

The `opts` object passed to `MyLogger` above includes `level`, `message`, and any other additional
info needed.

- `level` will be a string, one of `info`, `warn`, `error`, `debug`.
- `message` is a string, like `Finished migrating.`.