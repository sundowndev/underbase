---
id: writting-migrations
title: Writting migrations
---

Now underbase is configured as your needs, start writting migrations !

By default, the CLI tool automatically support ES6 for migrations files. You don't have to use Babel. To start, create the migrations folder :

```shell
underbase init
```

Let's create a new version and a migration file :

```shell
mkdir ./migrations/1.0
touch ./migrations/1.0/index.js
```

The entry file for our new version will look like this. Underbase always need an index file to run migrations.

```js
// migrations/1.0/index.js
import users from './users';

export default {
  version: 1.0,
  describe: 'Fix minor typo in fields',
  up: async ({ Migrate, Query, Logger }) => {
    const NumberOfUsers = await Query.collection('Users').count();

    Logger(`Migrating ${NumberOfUsers} users and ${NumberOfTasks} tasks...`);

    await Migrate([users]); // Executes up function of users migrations asynchronously

    Logger('Finished migrating 1.0!');
  },
  down: async ({ Migrate }) => {
    await Migrate([users]); // Executes down function of users migrations asynchronously
  },
};
```

To run this migration, use the `migrate` command :

```shell
underbase migrate 1.0 --config config.js
```