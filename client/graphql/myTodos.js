import { gql } from '@apollo/client';

export default gql`
  query myTodos {
    myTodos {
      id
      content
      datetime
    }
  }
`;
