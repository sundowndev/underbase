import { IMigrationOptions, SyslogLevels } from './interfaces';
import { Migration } from './migration';

const migrator = new Migration();

export { migrator, Migration, IMigrationOptions, SyslogLevels };
