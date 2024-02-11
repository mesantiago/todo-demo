import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import MY_TODOS_QUERY from '../graphql/myTodos';
import Screen from '../components/Screen';
import TodoList from '../components/TodoList';

const styles = StyleSheet.create({
  home: {
    alignItems: 'center',
  },
});

function HomeScreen({ user, navigation }) {
  const { data, refetch } = useQuery(MY_TODOS_QUERY);
  const [todoList, setTodoList] = React.useState(data?.data?.myTodos || []);

  const updateTodoList = () => refetch()
    .then((response) => setTodoList(response?.data?.myTodos || []));

  useEffect(() => {
    if (user) {
      updateTodoList();
    } else if (navigation.isReady()) {
      navigation.navigate({ name: 'Login' });
    }
  }, []);

  return (
    <Screen>
      <View style={styles.home}>
        <TodoList user={user} list={todoList} onChange={updateTodoList} />
      </View>
    </Screen>
  );
}

HomeScreen.propTypes = {
  user: PropTypes.shape({}),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
  }).isRequired,
};

HomeScreen.defaultProps = {
  user: undefined,
};

export default HomeScreen;
