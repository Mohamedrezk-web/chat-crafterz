import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DefaultOptions,
} from '@apollo/client';

export const BASE_URL =
  process.env.NODE_ENV !== 'development'
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';

const httpLink = createHttpLink({
  uri: `${BASE_URL}/api/graphql`,
  headers: {
    Authorization: `apikey ${process.env.NEXT_PUBLIC_GRAPHQL_TOKEN}`,
  },
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions,
  connectToDevTools: true,
});

export default client;
