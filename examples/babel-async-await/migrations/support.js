module.exports = (on, { config }) => {
  on('connect', () => console.log('Running!'));

  on('migrate', () => {
    console.log('Migrating!');
  });
};
