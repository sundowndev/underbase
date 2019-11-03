---
id: organize
title: Organizing migrations
---

Organizing your migrations workflow is quite easy using configuration files and versionned folders.

## File structure

For example, consider the following file structure :

```text
# Your app code base
migrations
├── 1.0
|   ├── index.js <-- entry file to execute migrations
|   ├── articles.js
|   ├── users.js
|   └── tags.js
├── 1.1
|   ├── index.js
|   ├── articles.js
├── 2.0 <-- major version
|   ├── index.js
|   ├── articles.js
|   ├── users.js
|   └── logs.js
└── config.js <-- configuration file
```

Managing multiple databases ?

```text
# Your app code base
migrations
├── api <-- API database
|   ├── 1.0
|   |   ├── index.js <-- entry file to execute migrations
|   |   ├── articles.js
|   |   ├── users.js
|   |   └── tags.js
|   ├── 1.1
|   |   ├── index.js
|   |   ├── articles.js
|   └── 2.0 <-- major version
|       ├── index.js
|       ├── articles.js
|       ├── users.js
|       └── logs.js
├── worker <-- Service worker database
|   └── 1.0
|       ├── index.js <-- entry file to execute migrations
|       ├── job.js
|── api.js <-- API configuration file
└── worker.js <-- Service worker configuration file
```

This would result in the following execution workflow :

![](https://i.imgur.com/iJWGEDS.png)

### File structure evolution

Every collections are migrated in the entrypoint.

![img1](https://i.imgur.com/bkHGZPZ.png)

Collections now have their own file and executed from the entrypoint.

![img2](https://i.imgur.com/QBqoyU7.png)

Collections now have their own folder with files, each file is attributed to a nested collection (e.g: Tokens for Users). Users and Tasks are now groups of migrations.

![img3](https://i.imgur.com/FhUQD01.png)

## Execution order & middlewares

The index file for each migration version is intended to register the version and execute all migrations.

This allows you to choose the execution order and add some actions between migrations.

```js
// Import collections mirgations
import users from './users';
import articles from './articles';
import logs from './logs';
import tags from './tags';

export default {
  version: 1.0,
  describe: 'Init collections',
  up: async ({ Migrate }) => {
    // ... do something

    await Migrate([articles, logs, users, tags]);

    // ... do something
  },
  down: async ({ Migrate }) => {
    await Migrate([articles, logs, users, tags]);
  },
};
```

**Warning:** every single arguments passed to `Migrate()` must be a valid migration object.