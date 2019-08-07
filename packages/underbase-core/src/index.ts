import { IMigrationOptions } from '@underbase/types';
import { Migration } from './migration';

const migrator = new Migration();

export { migrator, Migration, IMigrationOptions };
