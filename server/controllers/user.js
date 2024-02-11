const bcrypt = require('bcryptjs');
const { authenticated, roleIs } = require('../middlewares/auth');

const queries = {};
const mutations = {};

queries.users = {
    schema: 'users: [User!]!',
    resolver: roleIs((root, args, { models }) => models.User.findAll(), ['ADMIN']),
};

queries.user = {
    schema: 'user(id: Int!): User',
    resolver: roleIs((root, { id }, { models }) => models.User.findByPk(id), ['ADMIN']),
};

mutations.createUser = {
    schema: 'createUser(role: String!, name: String!, username: String!, password: String!): User!',
    resolver: roleIs(async (root, {
        role, name, username, password,
    }, { models }) => {
        const matchedRole = await models.Role.findOne({ where: { name: role } });
        if (!matchedRole) {
            throw new Error('Invalid role');
        }
        const matchedUsername = await models.User.findOne({ where: { username } });
        if (matchedUsername) {
            throw new Error('Username already exist');
        }
        const newUser = await models.User.create({
            roleId: matchedRole.id,
            name,
            username,
            password: await bcrypt.hash(password, 10),
        });
        return newUser;
    }, ['ADMIN']),
};

mutations.updateUser = {
    schema: 'updateUser(id:Int!, role:String, name: String, username: String, password: String): User!',
    resolver: authenticated(async (root, {
        id, role, name, username, password,
    }, { models, user }) => {
        const matchedUser = await models.User.findByPk(id);
        if (!matchedUser) {
            throw new Error('User does not exist');
        }
        if (user.role.name === 'USER' && matchedUser.id !== user.id) {
            throw new Error('Unauthorized');
        }
        let matchedRole;
        if (role) {
            matchedRole = await models.Role.findOne({ where: { name: role } });
            if (!matchedRole) {
                throw new Error('Invalid role');
            }
        }
        if (username) {
            const matchedUsername = await models.User.findOne({ where: { username } });
            if (matchedUsername && matchedUsername.id !== matchedUser.id) {
                throw new Error('Username already exist');
            }
        }
        await models.User.update({
            roleId: user.role.name === 'USER' ? undefined : matchedRole?.id,
            name,
            username,
            password: password ? await bcrypt.hash(password, 10) : undefined,
        }, { where: { id } });
        return models.User.findByPk(id);
    }),
};

mutations.deleteUser = {
    schema: 'deleteUser(id:Int!): User!',
    resolver: roleIs(async (root, { id }, { models, user }) => {
        const matchedUser = await models.User.findByPk(id);
        if (!matchedUser) {
            throw new Error('User does not exist');
        }
        if (matchedUser.id === user.id) {
            throw new Error('Unauthorized');
        }
        await models.User.destroy({ where: { id } });
        await models.Todo.destroy({ where: { userId: id } });
        return matchedUser;
    }, ['ADMIN']),
};

const resolvers = {
    name: 'User',
    role: (user) => user.getRole(),
    todos: (user) => user.getTodos(),
};

module.exports = {
    queries,
    mutations,
    resolvers,
};
