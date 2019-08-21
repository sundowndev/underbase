#!/usr/bin/env node

// tslint:disable:no-var-requires
// tslint:disable:no-console
import { IConfigFile } from '@underbase/types';
import { exit, logger } from '@underbase/utils';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as yargs from 'yargs';

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
    .command(commands.migrate.command, commands.migrate.describe)
    .command(commands.init.command, commands.init.describe)
    .command(commands.list.command, commands.list.describe)
    .command(commands.status.command, commands.status.describe)
    .command(commands.unlock.command, commands.unlock.describe)
    .command(commands.rerun.command, commands.rerun.describe)
    .command(commands.validate.command, commands.validate.describe)
    .options(args.options)
    .describe('version', 'Show package version')
    .help('h', 'Show this help message')
    .alias('h', 'help')
    .locale('en_US')
    .epilogue(args.docs)
    .parse();

  if (fs.existsSync(path.resolve(argv.config))) {
    configFile = await import(path.resolve(argv.config));
  }

  const config: IConfigFile = {
    // False disables logging
    logs: (argv.logs as boolean) || (configFile.logs as boolean) || true,
    // Null or a function
    logger: logger as any,
    // Enable/disable info log "already at latest."
    logIfLatest: true,
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
    compiler: argv.compiler || configFile.compiler,
    supportFile: argv.supportFile || configFile.supportFile,
  };

  validators.checkNoArgPassed(yargs, argv);

  const versions = fs.existsSync(config.migrationsDir as fs.PathLike)
    ? (fs
        .readdirSync(config.migrationsDir as fs.PathLike)
        .filter((v: string) => v.match(new RegExp(/^[\d].[\d]$/))) as string[])
    : [];
  const targetCommand = commands[argv._[0]];

  if (targetCommand) {
    validators.checkMigrationDirExists(config);

    await targetCommand.action({
      config,
      versions,
      argv,
    });
  } else {
    logger.error(
      'Invalid command. Use --help option to show available commands.',
    );
  }

  exit();
}

main();
