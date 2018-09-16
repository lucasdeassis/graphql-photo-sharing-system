const { GraphQLDateTime } = require('graphql-iso-date');
const { GraphQLUpload } = require('apollo-server-express');

module.exports = {
  resolver: {
    DateTime: GraphQLDateTime,
    Upload: GraphQLUpload,
  },
};
