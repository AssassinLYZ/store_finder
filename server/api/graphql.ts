import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler } from '@as-integrations/h3';
import { storeSchema } from '../graphql/schemas/store';
import { storeResolvers } from '../graphql/resolvers/store';

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs: storeSchema,
  resolvers: storeResolvers,
  introspection: true, // Enable schema introspection (useful in dev tools)
  includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
  formatError: (err) => {
    // Customize GraphQL error formatting
    return {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && {
        locations: err.locations,
        path: err.path,
        extensions: err.extensions,
      }),
    };
  },
});

export default startServerAndCreateH3Handler(server, {
  context: async () => {
    // Add custom context for each request
    return {
      requestId: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
    };
  },
});

// Export schema and resolvers for code generation and reuse
export { storeSchema, storeResolvers };
