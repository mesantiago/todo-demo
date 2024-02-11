const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const { gql } = require('apollo-server');

const schemas = [];
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
    const schema = require(path.join(__dirname, file));
        schemas.push(schema.trim());
    });

// Read controller schemas
const querySchemas = [];
const mutationSchemas = [];
fs
    .readdirSync(path.join(__dirname, '..', 'controllers'))
    .filter((file) => (
        file.indexOf('.') !== 0
    && file !== basename
    && file.slice(-3) === '.js'
    && file.indexOf('.test.js') === -1
    ))
    .forEach((file) => {
    /* eslint-disable-next-line */
    const controller = require(path.join(__dirname, '..', 'controllers', file));
        Object.keys(controller.queries).forEach((key) => {
            querySchemas.push(controller.queries[key].schema.trim());
        });
        Object.keys(controller.mutations).forEach((key) => {
            mutationSchemas.push(controller.mutations[key].schema.trim());
        });
    });

const typeDefs = gql`
${schemas.join('\n')}

type Query {
    ${querySchemas.join('\n')}
}

type Mutation {
    ${mutationSchemas.join('\n')}
}`;

module.exports = typeDefs;
