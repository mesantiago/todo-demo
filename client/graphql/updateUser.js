import { gql } from '@apollo/client';

export default gql`
  mutation updateUser($id: Int!, $username: String, $name: String, $role: String, $password: String) {
    updateUser(id: $id, username: $username, name: $name, role: $role, password: $password) {
      id
      username
      name
      role {
        name
      }
    }
  }
`;
