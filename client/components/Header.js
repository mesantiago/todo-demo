import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  TouchableHighlight,
} from 'react-native';
import * as PropTypes from 'prop-types';

import colors from '../config/colors';
import Auth from '../utils/authentication';

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: '20px',
  },
  appName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    right: 10,
  },
  adminButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 5,
  },
});

export default function Header({
  isAuthenticated,
  user,
  currentPage,
  changePage,
  onLogin,
  onLogout,
}) {
  const userRole = user?.role?.name;
  const logOut = async () => {
    await Auth.logout();
    onLogout();
  };
  useEffect(() => {}, [isAuthenticated]);

  const getAuthButton = () => {
    if (isAuthenticated) {
      return (
        <TouchableHighlight style={styles.button}>
          <Button
            title="Log out"
            style={styles.button}
            color={colors.primaryButton}
            onPress={logOut}
          />
        </TouchableHighlight>
      );
    } if (currentPage) {
      return (
        <TouchableHighlight style={styles.button}>
          { currentPage.name === 'Login' ? (
            <Button
              title="Sign up"
              style={styles.button}
              color={colors.primaryButton}
              onPress={() => changePage('SignUp')}
            />
          )
            : (
              <Button
                title="Login"
                style={styles.button}
                color={colors.primaryButton}
                onPress={onLogin}
              />
            )}
        </TouchableHighlight>
      );
    }
    return null;
  };

  const getAdminButtons = () => {
    if (!isAuthenticated || userRole !== 'ADMIN') {
      return null;
    }
    return (
      <View style={styles.adminButtonsContainer}>
        <TouchableHighlight style={styles.button}>
          <Button
            title="My Todos"
            color={colors.primaryButton}
            onPress={() => changePage('Home')}
          />
        </TouchableHighlight>
        <TouchableHighlight style={styles.button}>
          <Button
            title="All Todos"
            color={colors.primaryButton}
            onPress={() => changePage('Todos')}
          />
        </TouchableHighlight>
        <TouchableHighlight style={styles.button}>
          <Button
            title="Users"
            color={colors.primaryButton}
            onPress={() => changePage('Users')}
          />
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => changePage('Home')}
      >
        <Text style={styles.appName}>FULL STACK DEMO</Text>
      </Pressable>
      <View style={styles.buttonsContainer}>
        {getAdminButtons()}
        {getAuthButton()}
      </View>
    </View>
  );
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  currentPage: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    role: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

Header.defaultProps = {
  currentPage: undefined,
  user: undefined,
};
