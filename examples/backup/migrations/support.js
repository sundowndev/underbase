const { exec } = require('child_process');

module.exports = (on, { config }) => {
  on('migrate', () => new Promise((resolve, reject) => {
        const mongodumpBin = 'mongodump';
        const version = '1.0';
        const backupFile = [version, `${Date.now()}.gz`].join('_');
        const filePath = [config.migrationsDir, 'backups', backupFile].join(
          '/',
        );
        const dbUrlSegments = config.db.split('/');

        config.logger.info('Creating backup...');

        let host;
        let database;

        if (dbUrlSegments[0] === 'mongodb:' && dbUrlSegments[1] === '') {
          host = dbUrlSegments[2];
          database = dbUrlSegments[3];
        } else {
          host = dbUrlSegments[0];
          database = dbUrlSegments[1];
        }

        const cmd = [
          mongodumpBin,
          `--host ${host}`,
          `--archive=${filePath}`,
          `--gzip --db ${database}`,
        ].join(' ');

        return exec(cmd, error => {
          if (error) {
            config.logger.error(
              'An error occured while creating backup file. Cancelling.',
            );
            return reject(error);
          }

          config.logger.success(`Backup created: ${filePath}`);

          return resolve();
        });
      }),
  );
};
