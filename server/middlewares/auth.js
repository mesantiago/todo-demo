const { auth } = require('../utils');

const authenticated = (cb) => async (root, inputs, data, ...args) => {
    const user = await auth.verifyToken(data?.authToken);
    if (!user) {
        throw new Error('Not signed in');
    }
    return cb(root, inputs, {
        user,
        ...data,
    }, ...args);
};

const roleIs = (cb, roles) => async (root, inputs, data, ...args) => {
    const user = await auth.verifyToken(data?.authToken);
    if (!user) {
        throw new Error('Not signed in');
    }
    if (!roles.includes(user?.role?.name)) {
        throw new Error('Unauthorized');
    }
    return cb(root, inputs, {
        user,
        ...data,
    }, ...args);
};

module.exports = {
    authenticated,
    roleIs,
};
