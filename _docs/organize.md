# Organizing migrations

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

The index file for each migration version is intended to register the version and execute all migrations. This allows you to choose the execution order and add some actions between migrations.

```js
// Import collections mirgations
import users from './users';
import articles from './articles';
import logs from './logs';
import tags from './tags';

export default {
  version: 1.0,
  name: 'Init collections', // use name property as a commit message
  up: async (db) => {
    // ... do something
    
    await articles.up(db);
    await logs.up(db);
    await users.up(db);
    await tags.up(db);
    
    // ... do something
  },
  down: async (db) => {
    await articles.down(db);
    await logs.down(db);
    await users.down(db);
    await tags.down(db);
  },
};
```
