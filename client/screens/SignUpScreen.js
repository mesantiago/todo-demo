import React from 'react';
import {
  View, StyleSheet, Text, TextInput, Button,
} from 'react-native';
import { useMutation } from '@apollo/client';

import Screen from '../components/Screen';
import SIGNUP_MUTATION from '../graphql/signup';
import colors from '../config/colors';

const styles = StyleSheet.create({
  signup: {
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  success: {
    color: colors.success,
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

function SignUpScreen() {
  const [signup, { loading: submitting }] = useMutation(SIGNUP_MUTATION);

  const [username, setUsername] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onSubmit = () => {
    if (submitting) {
      return false;
    }
    setErrorMessage('');
    if (!name) {
      return setErrorMessage('Name is required');
    }
    if (!username) {
      return setErrorMessage('Username is required');
    }
    if (!password) {
      return setErrorMessage('Password is required');
    }
    return signup({
      variables: {
        username,
        name,
        password,
      },
    })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        setErrorMessage(err?.message || 'Something went wrong');
      });
  };

  return (
    <Screen>
      <View style={styles.signup}>
        <View style={styles.form}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign up to Todo-list</Text>
          </View>
          {success
            ? (
              <View style={styles.messageContainer}>
                <Text style={styles.success}>
                  Successfully created user
                  {' '}
                  {username}
                </Text>
                <Text style={styles.success}>Please login to continue</Text>
              </View>
            )
            : (
              <View>
                <View style={styles.messageContainer}>
                  <Text style={styles.error}>{errorMessage}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  onSubmitEditing={onSubmit}
                  placeholder="Name"
                />
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
                  disabled={submitting}
                  color={colors.secondaryButton}
                  onPress={onSubmit}
                />
              </View>
            )}
        </View>
      </View>
    </Screen>
  );
}

export default SignUpScreen;
