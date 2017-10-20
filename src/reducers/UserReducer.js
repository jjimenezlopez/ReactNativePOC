import {
  SET_USER_NAME,
  SET_USER_AVATAR,
  GET_USER_ID,
  GET_USER_NAME,
  GET_USER_AVATAR
} from '../actions/types';

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, ...action.payload };
    case SET_USER_AVATAR:
      return { ...state, ...action.payload };
    case GET_USER_ID:
      return { ...state, ...action.payload };
    case GET_USER_NAME:
      return { ...state, ...action.payload };
    case GET_USER_AVATAR:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
