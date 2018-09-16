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
      uploadPhoto: async (root, args, { user, db }) => {
        const { _id } = await Photo.mutation.uploadPhoto(db, user, args);

        return Photo.query.photo(db, _id, user);
      },

      editPhoto: (root, args, { user, db }) => Photo.mutation.editPhoto(db, user, args),

      deletePhoto: (root, args, { user, db }) => Photo.mutation.deletePhoto(db, user, args),
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
