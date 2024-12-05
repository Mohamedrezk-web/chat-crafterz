'user client';
import client from '@/graphql/apolloClient';
import { ApolloProvider } from '@apollo/client';
import React from 'react';

function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default ApolloProviderWrapper;
