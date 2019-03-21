#!/usr/bin/env node

import { migrator } from './dist/src/index';
import yargs from 'yargs';
import path from 'path';
import fs from 'fs';

const argv = yargs
  .command('migrate <migration>', 'Execute migrations')
  .command('list', 'Show all migrations versions')
  .command('status', 'Show migrations status')
  .argv;

let metro = {};

try {
  metro = require(argv.config);
}
catch(err) {}

const config = {
  // false disables logging
  log: true,
  // null or a function
  logger: (level, ...arg) => console.log(`[${level}]`, ...arg),
  // enable/disable info log "already at latest."
  logIfLatest: true,
  // migrations collection name. Defaults to 'migrations'
  collectionName: metro.collectionName || 'migrations',
  // mongdb url
  db: argv.db || metro.db || "mongodb://localhost:27017/api",
  // enable automatic backups
  backups: metro.backups || false,
  // directory to save backups
  backupsDir: path.resolve(argv.backupsDir || metro.backupsDir || './migrations/backups'),
  migrationsDir: path.resolve(argv.migrationsDir || metro.migrationsDir || './migrations'),
};

(async () => {
  await migrator.config(config); // Returns a promise

  let versions = fs.readdirSync(config.migrationsDir)
    .filter((v) => v.match(new RegExp(/^[\d].[\d]$/)));

  switch (argv._[0]) {
    case 'migrate':
      versions = versions.map((v) => parseFloat(v));
      // console.log(versions, argv.migration);

      if (argv.migration != 0 && versions.indexOf(parseFloat(argv.migration)) < 0) {
        console.log('This version does not exists.');
        process.exit();
      }

      versions = versions.map((v) => v.toFixed(1));

      versions.forEach(async (v) => {
        // console.log(`${config.migrationsDir}/${v.toString()}`);
        const migrationObj = require(`${config.migrationsDir}/${v}`).default;
        await migrator.add(migrationObj);
      });

      await migrator.migrateTo(argv.migration);
      break;
    case 'list':
      versions.forEach((v) => console.log(v));
      break;
    case 'status':
      break;
    default:
      console.log('help');
      break;
  }

  if (config.backup) { }

  process.exit();
})();
