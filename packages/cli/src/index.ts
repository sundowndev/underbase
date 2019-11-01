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

let configFile: IConfigFile | any = {};

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

  const config: IConfigFile = {
    // False disables logging
    logs:
      configFile.logs !== undefined
        ? (configFile.logs as boolean)
        : (argv.logs as boolean),
    // Null or a function
    logger: logger as any,
    // Enable/disable info log "already at latest."
    logIfLatest:
      configFile.logIfLatest !== undefined
        ? (configFile.logIfLatest as boolean)
        : (argv.logIfLatest as boolean),
    // Migrations collection name. Defaults to 'migrations'
    collectionName: configFile.collectionName
      ? (configFile.collectionName as string)
      : (argv.collectionName as string),
    // MongDB connection url
    db: configFile.db ? (configFile.db as string) : (argv.db as string),
    migrationsDir: path.resolve(
      configFile.migrationsDir
        ? (configFile.migrationsDir as string)
        : (argv.migrationsDir as string),
    ),
    supportFile: configFile.supportFile || argv.supportFile,
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
