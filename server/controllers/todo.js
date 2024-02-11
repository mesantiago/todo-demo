const { authenticated, roleIs } = require('../middlewares/auth');

const queries = {};
const mutations = {};

queries.todos = {
    schema: 'todos: [Todo!]!',
    resolver: roleIs((root, inputs, { models }) => models.Todo.findAll({
        order: [['datetime', 'asc']],
    }), ['ADMIN']),
};

queries.myTodos = {
    schema: 'myTodos: [Todo!]!',
    resolver: authenticated((root, inputs, { models, user }) => models.Todo.findAll({
        where: { userId: user.id },
        order: [['datetime', 'asc']],
    })),
};

queries.todo = {
    schema: 'todo(id: Int!): Todo',
    resolver: roleIs((root, { id }, { models }) => models.Todo.findByPk(id)),
};

mutations.createTodo = {
    schema: 'createTodo(content: String!, datetime: String!, username: String): Todo!',
    resolver: authenticated(async (root, {
        content, datetime, username,
    }, { models, user }) => {
        let todoUserId;
        const date = new Date(datetime);
        /* eslint-disable-next-line no-restricted-globals */
        if (isNaN(date)) {
            throw new Error('Invalid date');
        }
        if (!username) {
            todoUserId = user.id;
        } else if (user.role.name === 'ADMIN') {
            const matchedUser = await models.User.findOne({ where: { username } });
            if (!matchedUser) {
                throw new Error('User does not exist');
            }
            todoUserId = matchedUser.id;
        } else {
            throw new Error('Unauthorized');
        }
        return models.Todo.create({
            content,
            datetime: date,
            userId: todoUserId,
            createdBy: user.id,
        });
    }, ['ADMIN']),
};

mutations.updateTodo = {
    schema: 'updateTodo(id:Int!, content:String, datetime: String): Todo!',
    resolver: authenticated(async (root, {
        id, content, datetime,
    }, { models, user }) => {
        const matchedTodo = await models.Todo.findByPk(id);
        if (!matchedTodo) {
            throw new Error('Todo does not exist');
        }
        if (matchedTodo.userId !== user.id && user.role.name !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        let date;
        if (datetime) {
            date = new Date(datetime);
            /* eslint-disable-next-line no-restricted-globals */
            if (isNaN(date)) {
                throw new Error('Invalid date');
            }
        }
        await models.Todo.update({
            content,
            datetime: date,
        }, { where: { id } });
        return models.Todo.findByPk(id);
    }),
};

mutations.deleteTodo = {
    schema: 'deleteTodo(id:Int!): Todo!',
    resolver: authenticated(async (root, { id }, { models, user }) => {
        const matchedTodo = await models.Todo.findByPk(id);
        if (!matchedTodo) {
            throw new Error('Todo does not exist');
        }
        if (matchedTodo.userId !== user.id && user.role.name !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        await models.Todo.destroy({ where: { id } });
        return matchedTodo;
    }),
};

const resolvers = {
    name: 'Todo',
    user: (todo) => todo.getUser(),
};

module.exports = {
    queries,
    mutations,
    resolvers,
};
