module.exports = `
  type User {
    id: Int!
    name: String!
    username: String!
    roleId: Int!
    role: Role
    todos: [Todo!]!
  }
`;
