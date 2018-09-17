import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const SERVER_PORT = 3001;

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:${SERVER_PORT}/graphql`,
  options: {
    reconnect: true,
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  createUploadLink({
    uri: `http://localhost:${SERVER_PORT}/graphql`,
    headers: { // Alice jwt token
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFsaWNlIiwiZXhwIjoxNTQyMzczNzE2LCJpYXQiOjE1MzcxOTMzMTZ9.9LrlnYEWgsAifDrkBit_AEjmn5vkgo6j-f0bB0-3lmc',
    },
  }),
);

const link = ApolloLink.from([terminatingLink]);


const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache().restore({ }),

});

export const withApolloClient = App => (
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);

export default apolloClient;
