const { homedir } = require('os');
const path = require('path');
const Datastore = require('nedb-promise');
const pkg = require('../package.json');

const defaultDatabaseFilename = () => path.join(homedir(), `.${pkg.name}`);

const modelNames = ['users', 'photos'];

const createDatabase = ({ filename = defaultDatabaseFilename(), autoload = true, ...rest } = {}) =>
  modelNames.reduce(
    (db, model) => ({
      ...db,
      [model]: new Datastore({
        filename: `${filename}.${model}.db`,
        autoload,
        ...rest,
      }),
    }),
    {},
  );

const clearDatabase = async () => {
  const db = await createDatabase();

  await db.users.remove({}, { multi: true });
  await db.photos.remove({}, { multi: true });
};

const seedDatabase = async (query, seedName) => {
  /* eslint-disable global-require */
  /* eslint-disable import/no-dynamic-require */
  const { up } = require(path.join(__dirname, 'seeds', `${seedName}.js`));
  /* eslint-enable global-require */
  /* eslint-enable import/no-dynamic-require */
  await up(query);
};

module.exports = { createDatabase, clearDatabase, seedDatabase };
