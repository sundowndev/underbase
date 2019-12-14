const Users = require('./users');

module.exports = {
  version: 1.1,
  describe: 'Update users collection',
  async up({ Migrate }) {
    await Migrate([Users]);
  },
  async down({ Migrate }) {
    await Migrate([Users]);
  },
};
