import { AsyncStorage } from 'react-native';

const AUTH_TOKEN = 'AUTH_TOKEN';
const USER = 'USER';

let token;
let user;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }

  token = await AsyncStorage.getItem(AUTH_TOKEN);
  return token;
};

export const setToken = (newToken) => {
  token = newToken;
  return AsyncStorage.setItem(AUTH_TOKEN, newToken);
};

export const signOut = () => {
  token = undefined;
  user = undefined;
  AsyncStorage.removeItem(USER);
  return AsyncStorage.removeItem(AUTH_TOKEN);
};

export const setUser = (newUser) => {
  user = newUser;
  return AsyncStorage.setItem(USER, newUser);
}
export const getUser = async () => {
  if (user) {
    return Promise.resolve(user);
  }

  user = await AsyncStorage.getItem(USER);
  return user;
};

