const Photo = require('../../../models/photo');

module.exports = {
  resolver: {
    Photo: { id: ({ _id }) => _id },
    User: {
      photos: (owner, args, { user, db }) => Photo.user.photos(db, owner, user),
    },
    Query: {
      photos: (root, args, { user, db }) => Photo.query.photos(db, user),

      photo: (root, { id }, { db, user }) => Photo.query.photo(db, id, user),
    },
    Mutation: {
      uploadPhoto: async (root, { image }, { user, db }) => {
        // TODO: handle uploadPhoto
      },

      editPhoto: async (root, args, { user }) => {
        // TODO: handle editPhoto
      },
      deletePhoto: async (root, args, { user }) => {
        // TODO: handle deletePhoto
      },
    },
    Subscription: {
      photoAdded: async (root, args, ctx) => {
        // TODO: handle photoAdded Subscription
      },
      photoEdited: async (root, args, ctx) => {
        // TODO: handle photoEdited Subscription
      },
      photoDeleted: async (root, args, ctx) => {
        // TODO: handle photoDeleted Subscription
      },
    },
  },
};
