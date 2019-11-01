module.exports = {
  db: 'mongodb://localhost:27017/underbase_example',
  migrationsDir: __dirname,
  collectionName: '_migrations',
  mongodumpBinary: 'docker exec -it underbase_underbase-db_1 mongodump',
  logs: true,
};
