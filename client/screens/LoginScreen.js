import React from 'react';
import {
  View, Text, StyleSheet, Button, TextInput,
} from 'react-native';
import * as PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

import Screen from '../components/Screen';
import LOGIN_MUTATION from '../graphql/login';
import Auth from '../utils/authentication';
import colors from '../config/colors';

const styles = StyleSheet.create({
  login: {
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  error: {
    color: colors.error,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: colors.primaryText,
    fontSize: 25,
    padding: 10,
  },
  form: {
    borderColor: colors.mutedText,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
    padding: 10,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.mutedText,
    padding: 10,
  },
});

function LoginScreen({ onLogin }) {
  const [login, { loading: submitting }] = useMutation(LOGIN_MUTATION);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const onSubmit = () => {
    if (submitting) {
      return false;
    }
    setErrorMessage('');
    if (!username) {
      return setErrorMessage('Username is required');
    }
    if (!password) {
      return setErrorMessage('Password is required');
    }
    return login({
      variables: {
        username,
        password,
      },
    })
      .then(async (response) => {
        const accessToken = response?.data?.login?.accessToken;
        const user = response?.data?.login?.user;
        await Auth.authenticate(accessToken, user);
        onLogin(user);
      })
      .catch((err) => setErrorMessage(err?.message || 'Something went wrong'));
  };

  return (
    <Screen>
      <View style={styles.login}>
        <View style={styles.form}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Login to Todo-list</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{errorMessage}</Text>
          </View>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            onSubmitEditing={onSubmit}
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={onSubmit}
            placeholder="Password"
          />
          <Button
            title="Submit"
            color={colors.secondaryButton}
            disabled={submitting}
            onPress={onSubmit}
          />
        </View>
      </View>
    </Screen>
  );
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginScreen;
