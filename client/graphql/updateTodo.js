import { gql } from '@apollo/client';

export default gql`
  mutation updateTodo($id: Int!, $datetime: String, $content: String) {
    updateTodo(id: $id, datetime: $datetime, content: $content) {
      id
      content
      datetime
    }
  }
`;
