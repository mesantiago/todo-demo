import React from 'react';
import { ApolloProvider } from '@apollo/client';
import createClient from './utils/apollo';
import EntryScreen from './screens';

const client = createClient();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <EntryScreen />
    </ApolloProvider>
  );
}
