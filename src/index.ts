import { IMigrationOptions, Migration, SyslogLevels } from './migration';

const migrator = new Migration();

if (process.env.MIGRATE) {
  migrator.migrateTo(process.env.MIGRATE);
}

export { migrator, Migration, IMigrationOptions, SyslogLevels };
