import {
  SET_USER_NAME,
  SET_USER_AVATAR
} from './types';

export const setUserName = (name) => ({
    type: SET_USER_NAME,
    payload: { name }
});

export const setUserAvatar = (avatar) => ({
    type: SET_USER_AVATAR,
    payload: { avatar }
});
