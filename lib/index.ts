import { IMigrationOptions, SyslogLevels } from './interfaces';
import { Migration } from './migration';

const migrator = new Migration();

if (process.env.MIGRATE) {
  migrator.migrateTo(process.env.MIGRATE);
}

export { migrator, Migration, IMigrationOptions, SyslogLevels };
