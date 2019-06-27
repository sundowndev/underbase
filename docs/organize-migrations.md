---
id: organize
title: Organizing migrations
---

Organizing your migrations workflow is quite easy using configuration files and versionned folders. For example, the CLI consider the following structure by default :

```
migrations
└── api <-- your database
    └── 1.0
        ├── index.js <-- entry file to execute migrations
        ├── articles.js
        ├── users.js
        └── tags.js
    └── 1.1
        ├── index.js
        ├── articles.js
    └── 2.0 <-- major version
        ├── index.js
        ├── articles.js
        ├── users.js
        └── logs.js
└── api.json <-- configuration file
```

![](https://i.imgur.com/iJWGEDS.png)

![](https://i.imgur.com/bkHGZPZ.png)

![](https://i.imgur.com/QBqoyU7.png)

![](https://i.imgur.com/FhUQD01.png)

The index file for each migration version is intended to register the version and execute all migrations. This allows you to choose the execution order and add some actions between migrations.

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
