const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('express-jwt');
const { createDatabase } = require('./database');
const createGraphQLSchema = require('./graphql');
const { secret, upload } = require('./config');

const DEFAULT_PORT = 3001;

const createServer = async () => {
  const app = express();
  const schema = await createGraphQLSchema();
  const db = await createDatabase();

  app.use(
    '/graphql',
    cors(),
    jwt({ secret, credentialsRequired: false }),
  );

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ user: req.user, db }),
    uploads: {
      maxFileSize: upload.maxFileSize,
    },
  });


  server.applyMiddleware({ app });

  return app;
};

const launchServer = async ({ port = DEFAULT_PORT }) => {
  const server = await createServer();
  return new Promise((resolve, reject) =>
    server.listen(port, err => (err ? reject(err) : resolve({ port, server }))));
};

if (module.parent) {
  module.exports = { createServer, launchServer };
} else {
  launchServer({ port: process.env.PORT }).then(
    /* eslint-disable no-console */
    ({ port }) => {
      console.log(`Server listening on http://localhost:${port}`);
      console.log(` --> GraphQL endpoint: http://localhost:${port}/graphql`);
    },
    error => console.error('Could not start server because', error),
    /* eslint-enable no-console */
  );
}
