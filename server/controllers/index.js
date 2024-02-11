const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

const queryResolvers = {};
const mutationResolvers = {};
const controllerResolvers = {};

fs
    .readdirSync(__dirname)
    .filter((file) => (
        file.indexOf('.') !== 0
    && file !== basename
    && file.slice(-3) === '.js'
    && file.indexOf('.test.js') === -1
    ))
    .forEach((file) => {
    /* eslint-disable-next-line */
    const { queries = {}, mutations = {}, resolvers } = require(path.join(__dirname, file));
        Object.keys(queries).forEach((key) => {
            queryResolvers[key] = queries[key].resolver;
        });
        Object.keys(mutations).forEach((key) => {
            mutationResolvers[key] = mutations[key].resolver;
        });
        if (resolvers) {
            const { name, ...controllerResolver } = resolvers;
            controllerResolvers[name] = controllerResolver;
        }
    });

const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    ...controllerResolvers,
};

module.exports = resolvers;
