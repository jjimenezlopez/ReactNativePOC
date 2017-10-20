import {
  // UPLOAD_RECORDING_SUCCESS,
  // UPLOAD_RECORDING_FAILED
  USER_START_AUTHORIZING,
  USER_AUTHORIZED,
  USER_AUTHORIZATION_ERROR,
  USER_SIGNED_OUT
} from '../actions/types';

const INITIAL_STATE = [];

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    // case UPLOAD_RECORDING_SUCCESS:
    //   return action.payload;
    // case UPLOAD_RECORDING_FAILED:
    //   return action.payload;
    case USER_START_AUTHORIZING:
      console.log('authorizing');
      return { ...state, authorizing: true };
    case USER_AUTHORIZED:
      return { ...state, authorizing: false, authorized: true };
    case USER_AUTHORIZATION_ERROR:
      return { ...state, autherror: true };
    case USER_SIGNED_OUT:
      return { ...state, authorized: false };
    default:
      return state;
  }
}
