---
id: writting-migrations
title: Writting migrations
---

Now underbase is configured as your needs, start writting migrations !

To get started, let's create a new version and a migration file :

```bash
# You can use the init command to create the migration
# directory depending on your configuration
underbase init

# Create a new version
mkdir migrations/1.0

# Create an entry-point for this version
echo "module.exports = {}" > migrations/1.0/index.js
```

The entry file for our new version will look like this. **Underbase always needs an entrypoint for each migration.**

```js
// migrations/1.0/index.js
module.exports = {
  version: 1.0,
  describe: 'Update users collection',
  async up({ Query }) {
    const Users = Query.collection('Users');

    await Users.rename('datecreated', 'dateCreated').where({
      datecreated: {
        $exists: true,
      },
    });
  },
  async down({ Query }) {
    const Users = Query.collection('Users');

    await Users.rename('dateCreated', 'datecreated').where({
      dateCreated: {
        $exists: true,
      },
    });
  },
};
```

To run this migration, use the `migrate` command :

```shell
underbase migrate 1.0
```