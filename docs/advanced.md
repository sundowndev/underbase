---
id: advanced
title: Advanced usage
---

A more complete set of migrations might look like:

```javascript
migrator.add({
  version: 1.0,
  describe: 'Name for this migration',
  up: function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 1.
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
  down: function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 0
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
});

migrator.add({
  version: 1.1,
  describe: 'Name for this migration',
  up: function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 2
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
  down: function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
  },
});
```

Control execution flow with promises:

```javascript
// using bluebird promise lib
import { Promise } from 'bluebird';

migrator.add({
  version: 1.3,
  describe: 'Name for this migration',
  up: Promise.method(function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 1.
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
    return MongoClient.collections('someCollection')....
  }),
  down: Promise.method(function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 0
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
    return MongoClient.collections('someCollection')....
  })
});
```

Control execution flow with async/await:

```javascript
migrator.add({
  version: 2.0,
  describe: 'Name for this migration',
  up: async function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 2
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
     await MongoClient.collections('someCollection')....
  },
  down: async function({ MongoClient, Query, Migrate, Logger }) {
    // use `MongoClient`(mongo driver Db instance) for migration setup to version 1
    // See http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html for db api
    await MongoClient.collections('someCollection')....
  }
});
```
