const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const models = require('../models');

// Load environment variables
dotenv.config();
const SECRET = process.env.secret;

const verifyToken = async (authToken) => {
    let user; let
        token;
    if (authToken) {
        try {
            token = jwt.verify(authToken, SECRET);
        } catch (err) {
            throw new Error('Unauthorized!');
        }
        user = await models.User.findByPk(token.id, { include: ['role'] });
    }
    return user;
};

module.exports = {
    verifyToken,
};
