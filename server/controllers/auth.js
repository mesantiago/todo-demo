const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { authenticated } = require('../middlewares/auth');

// Load environment variables
dotenv.config();
const SECRET = process.env.secret;

const queries = {};
const mutations = {};

mutations.login = {
    schema: 'login(username: String!, password: String!): Token!',
    resolver: async (root, { username, password }, { models }) => {
        const user = await models.User.findOne({ where: { username } });
        if (!user) {
            throw new Error('Incorrect username and password combination');
        }
        const passworIsValid = await bcrypt.compare(password, user.password);
        if (!passworIsValid) {
            throw new Error('Incorrect username and password combination');
        }
        const accessToken = jwt.sign({ id: user.id }, SECRET, {
            expiresIn: 86400, // 24 hours
        });
        return {
            accessToken,
            user,
        };
    },
};

mutations.signup = {
    schema: 'signup(name: String!, username: String!, password: String!): User!',
    resolver: async (root, { name, username, password }, { models }) => {
        const userRole = await models.Role.findOne({ where: { name: 'USER' } });
        const matchedUsername = await models.User.findOne({ where: { username } });
        if (matchedUsername) {
            throw new Error('Username already exist');
        }
        return models.User.create({
            roleId: userRole?.id,
            name,
            username,
            password: await bcrypt.hash(password, 10),
        });
    },
};

queries.me = {
    schema: 'me: User!',
    resolver: authenticated((root, inputs, { user }) => user),
};

module.exports = {
    queries,
    mutations,
};
