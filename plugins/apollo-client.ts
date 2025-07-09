import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { defineNuxtPlugin } from 'nuxt/app';
import type { NuxtApp } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const config = useRuntimeConfig();
  const httpLink = createHttpLink({
    uri: config.public.apiUrl,
    credentials: 'same-origin',
  });

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
    ssrMode: import.meta.server,
  });

  nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient);
});

// function getGraphQLUrl(): string {
//   if (process.env.NODE_ENV === 'development') {
//     return 'http://localhost:3002/api/graphql';
//   } else {
//     return 'http://localhost:3000/api/graphql';
//   }
// }