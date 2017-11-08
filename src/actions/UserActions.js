import { AsyncStorage } from 'react-native';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import {
  SET_USER_NAME,
  SET_USER_DATA,
  GET_USER_ID,
  GET_USER_NAME,
  GET_USER_DATA,
  FB_DATA_ERROR,
  FB_DATA_REQUEST,
  FB_DATA_REQUESTED
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

export const setUserData = (data) => async (dispatch) => {
  const { name, avatar } = data;

  await AsyncStorage.setItem(USER_NAME, name);
  await AsyncStorage.setItem(USER_AVATAR, avatar);

  dispatch({
    type: SET_USER_DATA,
    payload: { name, avatar }
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

export const getUserFBData = () => async dispatch => {
  dispatch({ type: FB_DATA_REQUEST });
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me',
      { parameters: { fields: { string: 'name,picture' } } },
      (error, result) => {
        if (error) {
          console.error(error);
          reject();
          dispatch({ type: FB_DATA_ERROR });
        } else {
          resolve();
          const { name, picture } = result;
          const payload = { name };
          if (!picture.data.is_silhouette) {
            payload.avatar = picture.data.url;
          }
          dispatch({ type: FB_DATA_REQUESTED, payload });
        }
      }
    );

    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
  });
};
