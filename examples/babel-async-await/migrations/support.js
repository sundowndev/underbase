module.exports = (on, { config }) => {
  on('connect', () => config.logger.log('Running!'));
  on('migrate', () => new Promise((resolve) => {
    config.logger.log('Migrating!')

    return resolve()
  }));
};
