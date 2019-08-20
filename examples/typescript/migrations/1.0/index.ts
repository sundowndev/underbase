import { QueryInterface } from '@underbase/underbase-types';
import tasks from './tasks';
import users from './users';

export default {
  version: 1.0,
  describe: 'Fix minor typo in fields',
  up: async ({
    Migrate,
    Query,
    Logger,
  }: {
    Migrate: any;
    Query: QueryInterface;
    Logger: any;
  }) => {
    const numberOfUsers = await Query.collection('Users').count();
    const numberOfTasks = await Query.collection('Tasks').count();

    Logger(`Migrating ${numberOfUsers} users and ${numberOfTasks} tasks...`);

    await Migrate([users, tasks]);

    Logger('Finished migrating 1.0!');
  },
  down: async ({ Migrate }: { Migrate: any }) => {
    await Migrate([users, tasks]);
  },
};
