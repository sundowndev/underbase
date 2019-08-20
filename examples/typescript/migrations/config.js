const path = require('path');

module.exports = {
  db: 'mongodb://localhost:27017/underbase_example',
  migrationsDir: __dirname,
  collectionName: '_migrations',
  backupsDir: path.join(__dirname, 'backups'),
  mongodumpBinary: 'docker exec -it underbase_underbase-db_1 mongodump',
  backup: false,
  logs: true,
  compiler: 'ts-node/register',
};
