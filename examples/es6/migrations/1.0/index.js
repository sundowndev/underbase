import users from './users';
import tasks from './tasks';

export default {
  version: 1.0,
  describe: 'Fix minor typo in fields',
  async up({ Migrate, Query, Logger }) {
    const NumberOfUsers = await Query.collection('Users').count();
    const NumberOfTasks = await Query.collection('Tasks').count();

    Logger(`Migrating ${NumberOfUsers} users and ${NumberOfTasks} tasks...`);

    await Migrate([users, tasks]);

    Logger('Finished migrating 1.0!');
  },
  async down({ Migrate }) {
    await Migrate([users, tasks]);
  },
};
