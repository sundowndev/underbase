#!/usr/bin/env node

import { IConfigFile } from '@underbase/types';
import { exit, logger } from '@underbase/utils';
import * as fs from 'fs-extra';
import * as path from 'path';
import yargs from 'yargs';

// CLI arguments
import * as args from './args';

// Middlewares
import * as validators from './middlewares/validators';

let configFile: IConfigFile;

export async function main() {
  const commands = await args.getCommands();

  const argv = yargs
    .scriptName('underbase')
    .usage(args.usage)
    .commandDir('commands')
    .strict()
    .options(args.options)
    .describe('version', 'Show package version')
    .help('h', 'Show this help message')
    .alias('h', 'help')
    .locale('en_US')
    .epilogue(args.docs).argv;

  if (fs.existsSync(path.resolve(argv.config))) {
    configFile = await import(path.resolve(argv.config));
  }

  let config: IConfigFile = Object.assign(configFile || {}, argv.default);

  config = {
    // False disables logging
    logs: config.logs,
    // Null or a function
    logger,
    // Enable/disable info log "already at latest."
    logIfLatest: config.logIfLatest,
    // Migrations collection name. Defaults to 'migrations'
    collectionName: config.collectionName,
    // MongDB connection url
    db: config.db,
    migrationsDir: config.migrationsDir
      ? path.resolve(config.migrationsDir)
      : 'migrations',
    supportFile: config.supportFile,
  };

  // Get versions sorted
  const versions = (fs.existsSync(config.migrationsDir as fs.PathLike)
    ? (fs
        .readdirSync(config.migrationsDir as fs.PathLike)
        .filter((v: string) => v.match(new RegExp(/^[\d].[\d]$/))) as string[])
    : []
  ).sort((a: string, b: string) => parseFloat(a) - parseFloat(b));

  const targetCommand = commands.find((c: any) => c.name === argv._[0]);

  if (targetCommand) {
    validators.checkMigrationDirExists(config);

    await targetCommand.action({
      config,
      versions,
      argv,
    });
  } else {
    yargs.showHelp('log');
  }

  exit();
}

main();
