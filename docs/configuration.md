---
id: configuration
title: Configuration
---

The CLI tool uses almost the same [configuration API](api-config) than the library.

```plaintext
Usage: underbase <command> [OPTIONS]

Commands:
  underbase init                 Initiate migration environment
  underbase list                 Show available migrations versions
  underbase migrate <migration>  Migrate to a specified version
  underbase rerun                Rerun the current version
  underbase status               Show migrations status
  underbase force-unlock         Force unlock migrations state
  underbase validate             Validate migration files and configuration.

Options:
  --version         Show package version                               [boolean]
  --config          Configuration file path.
                                       [string] [default: "underbase.config.js"]
  --db              MongoDB connection URL.               [string] [default: ""]
  --migrationsDir   Migrations versions directory.
                                              [string] [default: "./migrations"]
  --collectionName  Migrations state collection.[string] [default: "migrations"]
  --logs            Enable logs.                       [boolean] [default: true]
  --logIfLatest     Log in the terminal if you are already at the specified
                    version.                           [boolean] [default: true]
  --supportFile     Support file path.                                  [string]
  -h, --help        Show this help message                             [boolean]

Documentation: https://sundowndev.github.io/underbase/
```

You can also use a JSON or JS file to define configuration :

```js
// underbase.config.js
const path = require('path');

module.exports = {
  db: 'mongodb://localhost:27017/underbase_example',
  migrationsDir: __dirname,
  collectionName: '_migrations',
  logs: true,
  supportFile: path.join(__dirname, 'support.js'),
};
```

And then use it as below :

```bash
underbase --config underbase.config.js
```

You can check MongoDB connection by running the `status` command :

```bash
underbase --config underbase.config.js status
```