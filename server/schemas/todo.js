module.exports = `
    type Todo {
        id: Int!
        content: String!
        datetime: String!
        userId: Int!
        user: User!
    }
`;
