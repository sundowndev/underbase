module.exports = (on, { config }) => {
  on('connect', () => config.logger.log('Running!'));
  on('migrate', () => config.logger.log('Migrating!'));
};
