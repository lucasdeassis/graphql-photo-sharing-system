const glue = require('schemaglue');
const { makeExecutableSchema } = require('apollo-server-express');
const schemaDirectives = require('./directives');

const createSchema = async () => {
  const { schema, resolver } = glue('graphql/types');

  return makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolver,
    schemaDirectives,
    formatError: () => new Error('Internal server error'),
  });
};

module.exports = createSchema;
