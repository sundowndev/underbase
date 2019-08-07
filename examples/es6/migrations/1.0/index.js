import users from './users';
import tasks from './tasks';

export default {
  version: 1.0,
  describe: 'Fix minor typo in fields',
  up: async ({ Migrate, Query, Logger }) => {
    const NumberOfUsers = await Query.collection('Users').count();
    const NumberOfTasks = await Query.collection('Tasks').count();

    Logger(`Migrating ${NumberOfUsers} users and ${NumberOfTasks} tasks...`);

    await Migrate([users, tasks]);

    Logger('Finished migrating 1.0!');
  },
  down: async ({ Migrate }) => {
    await Migrate([users, tasks]);
  },
};
