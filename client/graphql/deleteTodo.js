import { gql } from '@apollo/client';

export default gql`
  mutation deleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      id
      content
      datetime
    }
  }
`;
