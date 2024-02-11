import React, { useEffect } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from '@apollo/client';
import ME_QUERY from '../graphql/me';

import Header from '../components/Header';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import UsersScreen from './UsersScreen';
import Auth from '../utils/authentication';
import AllTodosScreen from './AllTodosScreen';

const Stack = createNativeStackNavigator();

export default function EntryScreen() {
  const { data, loading } = useQuery(ME_QUERY);

  const [currentPage, changeCurrentPage] = React.useState();
  const [currentUser, changeCurrentUser] = React.useState();
  const [isAuthenticated, changeAuthentication] = React.useState(false);
  const navigation = useNavigationContainerRef();

  const determineLandingPage = () => {
    if (!loading && navigation.isReady()) {
      if (!isAuthenticated) {
        navigation.reset({
          index: 1,
          routes: [{ name: 'Login' }],
        });
      } else {
        navigation.reset({
          index: 1,
          routes: [{ name: 'Home' }],
        });
      }
    }
  };

  // Listeners
  useEffect(() => {
    if (!loading) {
      Auth.setUser(data?.me);
      changeCurrentUser(Auth.getCurrentUser());
    }
  }, [data]);
  useEffect(() => changeAuthentication(!!currentUser), [currentUser]);
  useEffect(() => determineLandingPage(), [isAuthenticated]);

  const onScreenChange = (params) => changeCurrentPage(params.routes[params.routes.length - 1]);
  const onAuthChange = () => changeCurrentUser(Auth.getCurrentUser());
  const onLogin = () => navigation.goBack();
  const changePage = (pageName) => navigation.navigate({ name: pageName });

  const getHeader = () => (
    <Header
      isAuthenticated={isAuthenticated}
      currentPage={currentPage}
      changePage={changePage}
      user={currentUser}
      onLogin={onLogin}
      onLogout={onAuthChange}
    />
  );

  // Replace null with loading screen
  return loading
    ? null
    : (
      <NavigationContainer
        ref={navigation}
        onReady={determineLandingPage}
        onStateChange={onScreenChange}
      >
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: () => getHeader(),
          }}
        >
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={onAuthChange} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} user={currentUser} navigation={navigation} />}
          </Stack.Screen>
          <Stack.Screen name="Todos">
            {(props) => <AllTodosScreen {...props} user={currentUser} navigation={navigation} />}
          </Stack.Screen>
          <Stack.Screen name="Users">
            {(props) => <UsersScreen {...props} user={currentUser} navigation={navigation} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
}
