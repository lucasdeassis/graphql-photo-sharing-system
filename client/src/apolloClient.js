import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3001/graphql',
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
  createUploadLink({ uri: 'http://localhost:3001/graphql' }),
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
