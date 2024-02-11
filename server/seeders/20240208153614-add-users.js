const bcrypt = require('bcryptjs');
const models = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const adminRole = await models.Role.findOne({ where: { name: 'ADMIN' } });
        const userRole = await models.Role.findOne({ where: { name: 'USER' } });
        await queryInterface.bulkInsert('Users', [
            {
                name: 'Sample Admin',
                username: 'admin',
                password: await bcrypt.hash('admin', 10),
                roleId: adminRole?.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }, {
                name: 'Sample User',
                username: 'user',
                password: await bcrypt.hash('user', 10),
                roleId: userRole?.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', {
            [Sequelize.Op.or]: [
                { username: 'admin' },
                { username: 'user' },
            ],
        }, {});
    },
};
