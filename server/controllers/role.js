const queries = {};
const mutations = {};
const { authenticated } = require('../middlewares/auth');

queries.roles = {
    schema: 'roles: [Role!]!',
    resolver: authenticated((root, inputs, { models }) => models.Role.findAll()),
};

queries.role = {
    schema: 'role(id: Int!): Role',
    resolver: authenticated((root, { id }, { models }) => models.Role.findByPk(id)),
};

const resolvers = {
    name: 'Role',
    users: (role) => role.getUsers(),
};

module.exports = {
    queries,
    mutations,
    resolvers,
};
