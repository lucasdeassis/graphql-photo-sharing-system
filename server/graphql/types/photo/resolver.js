const Photo = require('../../../models/photo');

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
      uploadPhoto: async (root, args, { user, db, pubsub }) => {
        const photoAdded = await Photo.mutation.uploadPhoto(db, user, args);

        if (photoAdded._id) {
          pubsub.publish(PHOTO_ADDED, { photoAdded });
          return photoAdded;
        }

        throw new Error(`Could not upload photo ${args.image.name} and add to database.`);
      },

      editPhoto: async (root, args, { user, db, pubsub }) => {
        const hasEdited = await Photo.mutation.editPhoto(db, user, args);

        if (hasEdited) {
          const photoEdited = await Photo.query.photo(db, args.id, user);
          pubsub.publish(PHOTO_EDITED, { photoEdited });

          return photoEdited;
        }

        throw new Error(`Photo with id '${args.id}' was not found.`);
      },

      deletePhoto: async (root, args, { user, db, pubsub }) => {
        const photoDeleted = await Photo.query.photo(db, args.id, user);
        const hasDeleted = await Photo.mutation.deletePhoto(db, user, args);

        if (hasDeleted) {
          pubsub.publish(PHOTO_DELETED, { photoDeleted });
          return true;
        }

        return false;
      },
    },
    Subscription: {
      photoAdded: {
        subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(PHOTO_ADDED),
      },
      photoEdited: {
        subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(PHOTO_EDITED),
      },
      photoDeleted: {
        subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(PHOTO_DELETED),
      },
    },
  },
};
