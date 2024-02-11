const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        static associate(models) {
            Todo.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Todo.init({
        content: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        datetime: {
            allowNull: false,
            type: DataTypes.DATE,
            get() {
                const value = this.getDataValue('datetime');
                return value ? new Date(value)?.toISOString?.() : undefined;
            },
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    }, {
        sequelize,
        modelName: 'Todo',
    });
    return Todo;
};
