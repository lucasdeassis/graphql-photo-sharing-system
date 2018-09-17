const { PubSub } = require('apollo-server-express');
const Photo = require('../../../models/photo');

const pubsub = new PubSub();
const PHOTO_ADDED = 'PHOTO_ADDED';
const PHOTO_EDITED = 'PHOTO_EDITED';
const PHOTO_DELETED = 'PHOTO_DELETED';

/* eslint-disable no-underscore-dangle */
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
        const newPhoto = await Photo.mutation.uploadPhoto(db, user, args);

        if (newPhoto.id) {
          pubsub.publish(PHOTO_ADDED, newPhoto);
        } else {
          throw new Error(`Could not upload photo ${args.image.name} and add to database.`);
        }

        return Photo.query.photo(db, newPhoto.id, user);
      },

      editPhoto: async (root, args, { user, db }) => {
        const edited = await Photo.mutation.editPhoto(db, user, args);

        if (edited) {
          const photo = await Photo.query.photo(db, args.id, user);
          pubsub.publish(PHOTO_EDITED, photo);

          return photo;
        }

        throw new Error(`Photo with id '${args.id}' was not found.`);
      },

      deletePhoto: async (root, args, { user, db }) => {
        const deleted = await Photo.mutation.deletePhoto(db, user, args);

        if (deleted) {
          const photo = await Photo.query.photo(db, args.id, user);

          pubsub.publish(PHOTO_DELETED, photo);
          return true;
        }

        return false;
      },
    },
    Subscription: {
      photoAdded: {
        subscribe: () => pubsub.asyncIterator(PHOTO_ADDED),
      },
      photoEdited: {
        subscribe: () => pubsub.asyncIterator(PHOTO_EDITED),
      },
      photoDeleted: {
        subscribe: () => pubsub.asyncIterator(PHOTO_DELETED),
      },
    },
  },
};
