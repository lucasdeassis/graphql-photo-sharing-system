const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { secret, crypto: { salt, iterations } } = require('../config');

class User {
  static hashPassword(password) {
    return crypto.pbkdf2Sync(password, salt, iterations, 256, 'sha256').toString('hex');
  }

  static signJwtToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user._id, // eslint-disable-line no-underscore-dangle
        name: user.name,
        exp: parseInt(exp.getTime() / 1000, 10),
      },
      secret,
    );
  }

  async register(database, username, password) {
    const hash = this.hashPassword(password);
    const id = await database.users.count({});

    return database.users.insert({
      _id: id + 1,
      name: username,
      password: hash,
    });
  }

  async login(database, username, password) {
    const user = await database.users.findOne({ name: username });
    const hash = this.hashPassword(password);

    if (!user || hash !== user.password) {
      throw new Error('Invalid Username or Password');
    }

    return {
      user,
      token: this.signJwtToken(user),
    };
  }
}

module.exports = User;
