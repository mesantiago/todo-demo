/* eslint-disable no-console */
const { ApolloServer } = require('apollo-server');
const dotenv = require('dotenv');
const typeDefs = require('./schemas');
const resolvers = require('./controllers');
const models = require('./models');

// Load environment variables
dotenv.config();
const PORT = process.env.port || 3000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const authToken = req?.headers?.authorization || '';
        return { models, authToken };
    },
});

server
    .listen({ port: PORT })
    .then(({ url }) => console.log(`🚀  Server ready at: ${url}`));
