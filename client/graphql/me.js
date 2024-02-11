import { gql } from '@apollo/client';

export default gql`
  query me {
    me {
      username
      name
      role {
        id
        name
      }
    }
  }
`;
