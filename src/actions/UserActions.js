import { AsyncStorage } from 'react-native';

import {
  SET_USER_NAME,
  SET_USER_AVATAR,
  GET_USER_ID,
  GET_USER_NAME,
  GET_USER_AVATAR
} from './types';

import {
  USER_UID,
  USER_NAME,
  USER_AVATAR
} from '../constants';

export const setUserName = (name) => async (dispatch) => {
  await AsyncStorage.setItem(USER_NAME, name);
  dispatch({
    type: SET_USER_NAME,
    payload: { name }
  });
};

export const setUserAvatar = (avatar) => async (dispatch) => {
  await AsyncStorage.setItem(USER_AVATAR, avatar);
  dispatch({
    type: SET_USER_AVATAR,
    payload: { avatar }
  });
};

export const getUserName = () => async dispatch => {
  const name = await AsyncStorage.getItem(USER_NAME);
  dispatch({ type: GET_USER_NAME, payload: { name } });
};

export const getUserAvatar = () => async dispatch => {
  const avatar = await AsyncStorage.getItem(USER_AVATAR);
  dispatch({ type: GET_USER_AVATAR, payload: { avatar } });
};

export const getUserID = () => async dispatch => {
  const id = await AsyncStorage.getItem(USER_UID);
  dispatch({ type: GET_USER_ID, payload: { id } });
};
