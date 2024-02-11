import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentUser;

const setAccesToken = (accessToken) => {
  switch (Platform.OS) {
  case 'android':
  case 'ios':
    return SecureStore.setItemAsync('authToken', accessToken);
  default:
    return AsyncStorage.setItem('authToken', accessToken);
  }
};

const getToken = () => {
  switch (Platform.OS) {
  case 'android':
  case 'ios':
    return SecureStore.getItemAsync('authToken');
  default:
    return AsyncStorage.getItem('authToken');
  }
};

const clearAccessToken = () => {
  switch (Platform.OS) {
  case 'android':
  case 'ios':
    return SecureStore.deleteItemAsync('authToken');
  default:
    return AsyncStorage.removeItem('authToken');
  }
};

export default {
  getToken,
  getCurrentUser() {
    return currentUser;
  },
  setUser(user) {
    currentUser = user;
  },
  authenticate(accessToken, user) {
    currentUser = user;
    return setAccesToken(accessToken);
  },
  async logout() {
    await clearAccessToken();
    currentUser = undefined;
  },
};
