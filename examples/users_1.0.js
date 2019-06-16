const { migrator } = require('../dist/src');

migrator
  .config({
    // false disables logging
    logs: true,
    // null or a function
    logger: (level, ...arg) => console.log(level, ...arg),
    // enable/disable info log "already at latest."
    logIfLatest: true,
    // migrations collection name. Defaults to 'migrations'
    collectionName: 'migrations',
    // mongdb url or mongo Db instance
    db: 'mongodb://localhost:27017/underbase_test',
  })
  .then(() => {
    migrator.add({
      version: 1.0,
      name: 'Users',
      up: (db) => {
        db.collection('users')
          .MongoClient()
          .updateMany(
            {},
            {
              $rename: { firstName: 'name' },
            },
            { multi: true }
          );
      },
      down: (db) => {
        db.collection('users')
          .MongoClient()
          .updateMany(
            {},
            {
              $rename: { name: 'firstName' },
            },
            { multi: true }
          );
      },
    });
  })
  .then(() => migrator.migrateTo(1.0))
  .then(process.exit);
