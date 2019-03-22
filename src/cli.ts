#!/usr/bin/env node

import { migrator } from './index';
import * as yargs from 'yargs';
import * as path from 'path';
import * as fs from 'fs';

interface configFile {
  collectionName: string,
  backups: boolean,
  backupsDir: string,
  migrationsDir: string,
  db: string,
  logs: boolean,
};

interface config extends configFile {
  log: boolean,
  logger: any,
  logIfLatest: boolean,
};

const argv = yargs
  .usage('Usage: $0 <command> [OPTIONS]')
  .command('migrate <migration>', 'Execute migrations')
  .command('list', 'Show all migrations versions')
  .command('status', 'Show migrations status')
  .describe('db', 'MongoDB connection URL')
  .describe('migrations-dir', 'Migrations versions directory')
  .describe('backups', 'Enable automatic backups')
  .describe('backups-dir', 'Backups directory')
  .describe('collection-name', 'Migrations state collection')
  .describe('logs', 'Enable logs')
  .help('h')
  .alias('h', 'help')
  .argv;

let metro = <configFile>{};

try {
  metro = require(<string>argv.config);
}
catch (err) { }

const config = <config>{
  // false disables logging
  log: argv.logs || metro.logs || true,
  // null or a function
  logger: (level: string, ...arg: Array<string>) => console.log(`[${level}]`, ...arg),
  // enable/disable info log "already at latest."
  logIfLatest: true,
  // migrations collection name. Defaults to 'migrations'
  collectionName: argv.collectionName || metro.collectionName || 'migrations',
  // mongdb url
  db: argv.db || metro.db || "mongodb://localhost:27017/api",
  // enable automatic backups
  backups: argv.backups || metro.backups || false,
  // directory to save backups
  backupsDir: path.resolve(<string>argv.backupsDir || metro.backupsDir || './migrations/backups'),
  migrationsDir: path.resolve(<string>argv.migrationsDir || metro.migrationsDir || './migrations'),
};

(async () => {
  await migrator.config(config); // Returns a promise

  let versions = <any>fs.readdirSync(config.migrationsDir)
    .filter((v) => v.match(new RegExp(/^[\d].[\d]$/)));

  switch (argv._[0]) {
    case 'migrate':
      if (!fs.existsSync(config.migrationsDir)) {
        config.logger('info', 'Created migration directory.');
        fs.mkdirSync(config.migrationsDir);
      }

      versions = versions.map((v: string) => parseFloat(v));
      // console.log(versions, argv.migration);

      if (argv.migration != 0 && versions.indexOf(parseFloat(<string>argv.migration)) < 0) {
        console.log('This version does not exists.');
        process.exit();
      }

      versions = versions.map((v: number) => v.toFixed(1));

      versions.forEach(async (v: string) => {
        const migrationObj = require(`${config.migrationsDir}/${v}`).default;
        await migrator.add(migrationObj);
      });

      await migrator.migrateTo(<string>argv.migration);
      break;
    case 'list':
      versions.forEach((v: string) => console.log(v));
      break;
    case 'status':
      break;
    default:
      console.log('show help');
      break;
  }

  if (config.backups) { }

  process.exit();
})();
