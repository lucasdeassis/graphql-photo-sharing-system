import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';

const apolloClient = new ApolloClient({
    cache: new InMemoryCache().restore({ }),
    link: createUploadLink({ uri: 'http://localhost:3001/graphql' }),
});

export const withApolloClient = App => (
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
);

export default apolloClient;
