# Configuration

You can configure Migration with the `config` method. Defaults are:

``` javascript
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

## CLI options

The CLI application uses almost the same configuration API than the library.

```
Usage: underbase <command> [OPTIONS]

Options:
  --version                 Show package version                       [boolean]
  --config <path>           JSON configuration file path
  --db <url>                MongoDB connection URL
  --migrations-dir <path>   Migrations versions directory
  --backup                  Enable automatic backups
  --backups-dir <path>      Backups directory
  --collection-name <name>  Migrations state collection
  --logs                    Enable logs
  --rerun                   Force migrations execution
  --chdir <path>            Change the working directory
  --mongodumpBinary <path>  Binary file for mongodump (it can be a docker exec
                            command)
  -h, --help                Show this help message                     [boolean]
```

You can also use a JSON file to define configuration :

```json
{
  "db": "mongodb://localhost:27017/underbase_test",
  "migrationsDir": "./migrations/underbase_test",
  "collectionName": "migrations",
  "backupsDir": "./migrations/underbase_test/backups",
  "mongodumpBinary": "mongodump",
  "backup": false,
  "logs": true
}
```

And use it as below :

```bash
underbase --config config.json
```