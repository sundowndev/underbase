import { create } from '../common/backup';
import { IMigration } from '../common/interfaces';
import { setConfig } from '../common/utils';
import { exit, logger, timer } from '../common/utils';

// Enable ES6 module for migrations files
require = require('esm')(module);

export default async ({ config, versions, argv }) => {
  const versionsArray = versions.map((v: string) => parseFloat(v)) as number[];

  if (
    argv.migration !== 0 &&
    versionsArray.indexOf(parseFloat(argv.migration as string)) < 0
  ) {
    logger('error', 'This version does not exists.');
    exit();
  }

  versions = versionsArray.map((v: number) => v.toFixed(1)) as string[];

  const migrator = await setConfig(config);

  versions.forEach(async (v: string) => {
    const migrationObj = (await require(`${config.migrationsDir}/${v}`)
      .default) as IMigration;

    await migrator.add(migrationObj);
  });

  if (config.backup) {
    const currentVersion = await migrator.getVersion();

    await create(config.mongodumpBinary, currentVersion, config.backupsDir);
  }

  const time = timer();

  if (argv.rerun) {
    await migrator.migrateTo(`${argv.migration},rerun`);
  } else {
    await migrator.migrateTo(argv.migration as string);
  }

  logger('info', `Time spent: ${time.spent()} sec`);
};
