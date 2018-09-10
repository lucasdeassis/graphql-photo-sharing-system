const User = require('../../../models/user');

module.exports = {
  resolver: {
    Mutation: {
      register: async (root, { username, password }, { db }) => User.register(db, username, password),

      login: async (root, { username, password }, { db }) => User.login(db, username, password),
    },
  },
};
