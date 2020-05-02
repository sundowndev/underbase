---
id: working-with-backups
title: Working with backups
---

When migrating in production, you may want to create a backup of your database before executing migrations, instead of using rollback feature.

Unfortunately, there's no built-in backup feature in underbase. But you can still achieve this using the built-in event emitter !

See [this code example](https://github.com/sundowndev/underbase/tree/master/examples/backup).

First, create a support file :

```js
// support.js
const { exec } = require('child_process');

module.exports = (on, { config }) => {
  on('migrate', async () => {
    const mongodumpBinary = 'mongodump';
    const host = '';
    const database = 'underbase_example';
    const filePath = path.join(__dirname, 'backups', 'v1.2.gz');

    const cmd = [
      mongodumpBinary,
      `--host ${host}`,
      `--archive=${filePath}`,
      `--gzip`,
      `--db ${database}`,
    ].join(' ');

    const promise = exec(cmd, error => {
      if (error) {
        config.logger.error(
          'An error occured while creating backup file. Cancelling.',
        );
        throw new Error(error);
      }

      config.logger.success(`Backup created: ${filePath}`);

      // Continue and start migrating
    });

    return Promise.all([promise]);
  });
};
```

Then add it to the configuration :

```js
// underbase.config.js
const path = require('path');

module.exports = {
  /* ... */
  supportFile: path.join(__dirname, 'support.js'),
};
```
