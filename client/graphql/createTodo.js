import { gql } from '@apollo/client';

export default gql`
  mutation createTodo($content: String!, $datetime: String!, $username: String) {
    createTodo(content: $content, datetime: $datetime, username: $username) {
      id
      content
      datetime
    }
  }
`;
