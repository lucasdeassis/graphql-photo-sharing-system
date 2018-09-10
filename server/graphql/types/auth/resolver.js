const User = require('../../../models/user');

module.exports = {
  resolver: {
    Mutation: {
      register: async (root, { username, password }, { db }) => new User().register(db, username, password),

      login: async (root, { username, password }, { db }) => new User().login(db, username, password),

      logout: async (root, args, context) => {
        // TODO: Handle user logout here
      },
    },
  },
};
