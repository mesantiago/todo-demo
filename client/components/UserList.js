import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import * as PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

import CREATE_USER_MUTATION from '../graphql/createUser';
import UPDATE_USER_MUTATION from '../graphql/updateUser';
import DELETE_USER_MUTATION from '../graphql/deleteUser';
import colors from '../config/colors';

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    color: colors.primaryText,
    fontSize: 25,
    padding: 10,
  },
  userList: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
  },
  userCard: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 3,
    marginTop: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.footerText,
  },
  role: {
    textAlign: 'right',
    fontSize: 8,
    color: colors.footerText,
  },
  centeredView: {
    flex: 1,
    justifyName: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  error: {
    color: colors.error,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    // alignItems: 'center',
    boxShadowColor: '#000',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.mutedText,
    padding: 10,
  },
  selectInput: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.mutedText,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default function UserList({ list, onChange }) {
  const [createUser, { loading: creating }] = useMutation(CREATE_USER_MUTATION);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER_MUTATION);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [id, setId] = React.useState();
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [role, setRole] = React.useState(null);
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const editUser = (item) => {
    setModalVisible(true);
    setId(item.id || '');
    setName(item.name || '');
    setUsername(item.username || '');
    setRole(item?.role?.name || '');
    setPassword('');
    setErrorMessage('');
  };

  const onSubmit = () => {
    if (creating || updating) {
      return false;
    }
    setErrorMessage('');
    if (!name) {
      return setErrorMessage('Name is required');
    }
    if (!username) {
      return setErrorMessage('Username is required');
    }
    if (!role) {
      return setErrorMessage('Role is required');
    }
    return (id ? updateUser : createUser)({
      variables: {
        id,
        name,
        username,
        role,
        password,
      },
    })
      .then(() => {
        onChange();
        setModalVisible(false);
      })
      .catch((err) => {
        setErrorMessage(err?.message || 'Something went wrong');
      });
  };

  const onDeleteUser = () => {
    if (deleting) {
      return false;
    }
    return deleteUser({
      variables: {
        id,
      },
    })
      .then(() => {
        onChange();
        setModalVisible(false);
      })
      .catch((err) => {
        setErrorMessage(err?.message || 'Something went wrong');
      });
  };

  const userList = [...(list || [])]
    .map((item) => (
      <Pressable key={item.id} onPress={() => editUser(item)}>
        <View style={styles.userCard}>
          <Text style={styles.role}>{item?.role?.name || ''}</Text>
          <Text style={styles.name}>{`${item.username} - ${item.name}`}</Text>
        </View>
      </Pressable>
    ));

  return (
    <View style={styles.userList}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          User list
        </Text>
      </View>
      <Button
        title="Add User"
        style={styles.button}
        color={colors.primaryButton}
        onPress={() => editUser({})}
      />
      {userList}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
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
            <RNPickerSelect
              placeholder={{
                label: 'Select a role...',
                value: '',
              }}
              items={[
                { label: 'Admin', value: 'ADMIN' },
                { label: 'User', value: 'USER' },
              ]}
              style={{
                inputWeb: styles.selectInput,
              }}
              onValueChange={(value) => setRole(value)}
              value={role}
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
              title={id ? 'Update' : 'Submit'}
              style={styles.button}
              color={colors.primaryButton}
              disabled={creating || updating}
              onPress={onSubmit}
            />
            {id
              ? (
                <Button
                  title="Delete"
                  style={styles.button}
                  color={colors.secondaryButton}
                  disabled={deleting}
                  onPress={onDeleteUser}
                />
              )
              : null}
            <Button
              title="Cancel"
              style={styles.button}
              color={colors.defaultButton}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

UserList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape),
  onChange: PropTypes.func.isRequired,
};

UserList.defaultProps = {
  list: [],
};
