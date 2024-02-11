const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
            User.hasMany(models.Todo);
        }
    }
    User.init({
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        roleId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
