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
};
