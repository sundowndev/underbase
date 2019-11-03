---
id: writting-migrations
title: Writting migrations
---

Now underbase is configured as your needs, start writting migrations !

To get started, let's create a new version and a migration file :

```shell
mkdir -p ./migrations/1.0 # creates a new version
touch ./migrations/1.0/index.js # creates an entry-point for this version
```

The entry file for our new version will look like this. **Underbase always need an entrypoint for each migration.**

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