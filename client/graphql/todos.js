import { gql } from '@apollo/client';

export default gql`
  query todos {
    todos {
      id
      content
      datetime
      user {
        id
        username
        name
      }
    }
  }
`;
