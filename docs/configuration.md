---
id: configuration
title: Configuration
---

The CLI application uses almost the same configuration API than the library.

```
Usage: underbase <command> [OPTIONS]

Commands:
  underbase migrate <migration>  Initiate migration environment
  underbase init                 Initiate migration environment
  underbase list                 Show available migrations versions
  underbase status               Show migrations status
  underbase unlock               Unlock migrations state

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

You can also use a JSON or JS file to define configuration :

```js
// config.Js
module.export = {
  db: 'mongodb://localhost:27017/underbase_test',
  migrationsDir: './migrations/underbase_test',
  collectionName: 'migrations',
  backupsDir: './migrations/underbase_test/backups',
  mongodumpBinary: 'mongodump',
  backup: false,
  logs: true,
};
```

And use it as below :

```bash
underbase --config config.js
```