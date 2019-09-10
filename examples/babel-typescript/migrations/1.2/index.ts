import { IMigrationUtils } from '@underbase-types';
import tasks from './tasks';

export default {
  version: 1.2,
  describe: 'Migrate Tasks',
  up: async ({ Migrate }: IMigrationUtils) => await Migrate([tasks]),
  down: async ({ Migrate }: IMigrationUtils) => await Migrate([tasks]),
};
