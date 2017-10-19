import {
  SET_USER_NAME,
  SET_USER_AVATAR,
  USER_START_AUTHORIZING,
  USER_AUTHORIZED,
  USER_AUTHORIZATION_ERROR
} from '../actions/types';

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, ...action.payload };
    case SET_USER_AVATAR:
      return { ...state, ...action.payload };
    case USER_START_AUTHORIZING:
      return { ...state, authorizing: true };
    case USER_AUTHORIZED:
      return { ...state, authorizing: false, authorized: true };
    case USER_AUTHORIZATION_ERROR:
      return { ...state, autherror: true };
    default:
      return state;
  }
}
