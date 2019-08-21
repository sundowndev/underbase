const path = require('path');

module.exports = {
  db: 'mongodb://localhost:27017/underbase_example',
  migrationsDir: __dirname,
  collectionName: '_migrations',
  mongodumpBinary: 'docker exec -it underbase_underbase-db_1 mongodump',
  logs: true,
  compiler: 'babel-register',
  supportFile: path.join(__dirname, 'support.js'),
};
