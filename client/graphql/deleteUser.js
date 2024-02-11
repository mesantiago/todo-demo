import { gql } from '@apollo/client';

export default gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
      name
      username
      role {
        name
      }
    }
  }
`;
