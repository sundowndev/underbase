# Troubleshooting

## Errors

1. Not migrating, control is locked

Migrations set a lock when they are migrating, to prevent multiple instances of your clustered app from running migrations simultaneously. If your migrations throw an exception, you will need to manually remove the lock (and ensure your db is still consistent) before re-running the migration.

To remove the lock on migrations, use the [unlock](/api#unlock) method :

``` javascript
async (/* ... */) => {
  await migrator.unlock();
}
```

You can also do it from the command-line :

``` bash
underbase unlock
```