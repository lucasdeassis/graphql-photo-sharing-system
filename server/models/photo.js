const sharp = require('sharp');

const processImage = async (stream) => {
  const buffer = await stream.read();

  const { width, height } = await sharp(buffer).metadata();

  return {
    width,
    height,
    base64Image: buffer.toString('base64'),
  };
};

/* eslint-disable no-underscore-dangle */
module.exports = {
  user: {
    photos: (database, owner, user) =>
      database.photos.cfind({
        $and: [
          { ownerId: owner._id },
          user
            ? {
              $or: [
                { $and: [{ private: true }, { ownerId: user.id }] },
                { private: false },
              ],
            }
            : { private: false },
        ],
      })
        .sort({ createdAt: -1 })
        .exec(),
  },

  query: {
    photos: (database, user) =>
      database.photos.cfind(user
        ? {
          $or: [
            { $and: [{ private: true }, { ownerId: parseInt(user.id, 10) }] },
            { private: false },
          ],
        }
        : { private: false })
        .sort({ createdAt: -1 })
        .exec(),

    photo: (database, id, user) =>
      database.photos.findOne({
        $and: [
          { _id: parseInt(id, 10) },
          user
            ? {
              $or: [
                { $and: [{ private: true }, { ownerId: user.id }] },
                { private: false },
              ],
            }
            : { private: false },
        ],
      }),
  },

  mutation: {
    uploadPhoto: async (database, user, { image, caption, private: isPrivate }) => {
      const { stream } = await image;

      const { width, height, base64Image } = await processImage(stream);
      const photoId = await database.photos.count({});

      return database.photos.insert({
        _id: photoId + 1,
        ownerId: user.id,
        private: isPrivate,
        caption,
        image: base64Image,
        width,
        height,
        createdAt: new Date(),
      });
    },

    editPhoto: async (database, user, { id, ...props }) => {
      const parsedId = parseInt(id, 10);
      const updated = await database.photos.update(
        {
          $and: [
            { _id: parsedId },
            { ownerId: user.id },
          ],
        },
        {
          $set: {
            ...props,
          },
        },
      );

      return updated
        ? database.photos.findOne({ _id: parsedId })
        : new Error(`Photo with id ${parsedId} not found.`);
    },

    deletePhoto: (database, user, { id }) =>
      database.photos.remove({
        $and: [
          { _id: parseInt(id, 10) },
          { ownerId: user.id },
        ],
      }),
  },
};
