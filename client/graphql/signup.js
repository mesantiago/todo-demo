import { gql } from '@apollo/client';

export default gql`
  mutation signup($name: String!, $username: String!, $password: String!) {
    signup(name: $name, username: $username, password: $password) {
      id
      name
      username
      role {
        id
        name
      }
    }
  }
`;
