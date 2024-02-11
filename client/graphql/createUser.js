import { gql } from '@apollo/client';

export default gql`
  mutation createUser($role: String!, $name: String!, $username: String!, $password: String!) {
    createUser(role: $role, name: $name, username: $username, password: $password) {
      id
      username
      name
      role {
        name
      }
    }
  }
`;
