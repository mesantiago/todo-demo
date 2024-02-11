import React from 'react';
import Moment from 'moment';
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

import CREATE_TODO_MUTATION from '../graphql/createTodo';
import UPDATE_TODO_MUTATION from '../graphql/updateTodo';
import DELETE_TODO_MUTATION from '../graphql/deleteTodo';
import colors from '../config/colors';

const dateTimeRegex = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    color: colors.primaryText,
    fontSize: 25,
    padding: 10,
  },
  todoList: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
  },
  todoCard: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 3,
    marginTop: 3,
  },
  content: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.footerText,
  },
  datetime: {
    textAlign: 'right',
    fontSize: 8,
    color: colors.footerText,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default function TodoList({ user, list, onChange }) {
  const [createTodo, { loading: creating }] = useMutation(CREATE_TODO_MUTATION);
  const [updateTodo, { loading: updating }] = useMutation(UPDATE_TODO_MUTATION);
  const [deleteTodo, { loading: deleting }] = useMutation(DELETE_TODO_MUTATION);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [id, setId] = React.useState();
  const [username, setUsername] = React.useState('');
  const [content, setContent] = React.useState('');
  const [datetime, setDateTime] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const editTodo = (item) => {
    setModalVisible(true);
    setDateTime(
      item.datetime ? Moment(item.datetime).format('MM.DD.YYYY HH:mm:ss') : '',
    );
    setUsername(item?.user?.username || '');
    setContent(item.content || '');
    setId(item.id || '');
    setErrorMessage('');
  };

  const onSubmit = () => {
    if (creating || updating) {
      return false;
    }
    setErrorMessage('');
    if (!content) {
      return setErrorMessage('Content is required');
    }
    if (!datetime) {
      return setErrorMessage('Date time is required');
    }
    const matches = datetime.match(dateTimeRegex);
    if (!matches) {
      return setErrorMessage('Invalid date time');
    }
    // Sanity check
    const month = parseInt(matches[1], 10) - 1; // months are 0-11
    const day = parseInt(matches[2], 10);
    const year = parseInt(matches[3], 10);
    const hour = parseInt(matches[4], 10);
    const minute = parseInt(matches[5], 10);
    const second = parseInt(matches[6], 10);
    const date = new Date(year, month, day, hour, minute, second);
    if (
      date.getFullYear() !== year
        || date.getMonth() !== month
        || date.getDate() !== day
        || date.getHours() !== hour
        || date.getMinutes() !== minute
        || date.getSeconds() !== second
    ) {
      return setErrorMessage('Invalid date time');
    }

    return (id ? updateTodo : createTodo)({
      variables: {
        id,
        username,
        content,
        datetime,
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

  const markAsDone = () => {
    if (deleting) {
      return false;
    }
    return deleteTodo({
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

  const todoList = [...(list || [])]
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .map((item) => (
      <Pressable key={item.id} onPress={() => editTodo(item)}>
        <View style={styles.todoCard}>
          <Text style={styles.datetime}>
            {Moment(item.datetime).format('MM.DD.YYYY HH:mm:ss')}
          </Text>
          <Text style={styles.content}>{`${user ? '' : `[${item?.user?.username}] `}${item.content}`}</Text>
        </View>
      </Pressable>
    ));

  return (
    <View style={styles.todoList}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {user?.name?.toUpperCase()}
          {' '}
          Todo list
        </Text>
      </View>
      <Button
        title="Add Todo"
        style={styles.button}
        color={colors.primaryButton}
        onPress={() => editTodo({})}
      />
      {todoList}
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
              value={content}
              onChangeText={setContent}
              onSubmitEditing={onSubmit}
              placeholder="What would you like to do?"
            />
            {!user ? (
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                onSubmitEditing={onSubmit}
                readOnly={!!id}
                placeholder="Username"
              />
            ) : null}
            <TextInput
              style={styles.input}
              value={datetime}
              onChangeText={setDateTime}
              onSubmitEditing={onSubmit}
              placeholder="MM.DD.YYYY HH:mm:ss"
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
                  title="Mark as Done"
                  style={styles.button}
                  color={colors.secondaryButton}
                  disabled={deleting}
                  onPress={markAsDone}
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

TodoList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape),
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func.isRequired,
};

TodoList.defaultProps = {
  list: [],
  user: undefined,
};
