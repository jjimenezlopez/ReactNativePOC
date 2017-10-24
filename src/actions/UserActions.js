import { AsyncStorage } from 'react-native';

import {
  SET_USER_NAME,
  GET_USER_ID,
  GET_USER_NAME,
  GET_USER_DATA
} from './types';

import {
  USER_UID,
  USER_NAME
} from '../constants';

export const setUserName = (name) => async (dispatch) => {
  await AsyncStorage.setItem(USER_NAME, name);
  dispatch({
    type: SET_USER_NAME,
    payload: { name }
  });
};

export const getUserData = () => async dispatch => {
  const name = await AsyncStorage.getItem(USER_NAME);
  const id = await AsyncStorage.getItem(USER_UID);
  dispatch({ type: GET_USER_DATA, payload: { name, id } });
};

export const getUserName = () => async dispatch => {
  const name = await AsyncStorage.getItem(USER_NAME);
  dispatch({ type: GET_USER_NAME, payload: { name } });
};

export const getUserID = () => async dispatch => {
  const id = await AsyncStorage.getItem(USER_UID);
  dispatch({ type: GET_USER_ID, payload: { id } });
};
