import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import USERS_QUERY from '../graphql/users';
import Screen from '../components/Screen';
import UserList from '../components/UserList';

const styles = StyleSheet.create({
  users: {
    alignItems: 'center',
  },
});

function UsersScreen({ user, navigation }) {
  const { data, refetch } = useQuery(USERS_QUERY);
  const [userList, setUserList] = React.useState(data?.data?.users || []);

  const updateUserList = () => refetch()
    .then((response) => setUserList(response?.data?.users || []));

  useEffect(() => {
    if (user) {
      updateUserList();
    } else if (navigation.isReady()) {
      navigation.navigate({ name: 'Login' });
    }
  }, []);

  return (
    <Screen>
      <View style={styles.users}>
        <UserList user={user} list={userList} onChange={updateUserList} />
      </View>
    </Screen>
  );
}

UsersScreen.propTypes = {
  user: PropTypes.shape({}),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
  }).isRequired,
};

UsersScreen.defaultProps = {
  user: undefined,
};

export default UsersScreen;
