import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import ALL_TODOS_QUERY from '../graphql/todos';
import Screen from '../components/Screen';
import TodoList from '../components/TodoList';

const styles = StyleSheet.create({
  home: {
    alignItems: 'center',
  },
});

function AllTodosScreen({ user }) {
  const { data, refetch } = useQuery(ALL_TODOS_QUERY);
  const [todoList, setTodoList] = React.useState(data?.data?.todos || []);

  const updateTodoList = () => refetch()
    .then((response) => setTodoList(response?.data?.todos || []));

  useEffect(() => {
    if (user) {
      updateTodoList();
    }
  }, []);

  return (
    <Screen>
      <View style={styles.home}>
        <TodoList list={todoList} onChange={updateTodoList} />
      </View>
    </Screen>
  );
}

AllTodosScreen.propTypes = {
  user: PropTypes.shape({}),
};

AllTodosScreen.defaultProps = {
  user: undefined,
};

export default AllTodosScreen;
