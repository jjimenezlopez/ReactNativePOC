import {
  SET_USER_NAME,
  GET_USER_ID,
  GET_USER_NAME,
  GET_USER_DATA,
  FB_DATA_REQUEST,
  FB_DATA_REQUESTED
} from '../actions/types';

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, ...action.payload };
    case GET_USER_ID:
      return { ...state, ...action.payload };
    case GET_USER_NAME:
      return { ...state, ...action.payload };
    case GET_USER_DATA:
      return { ...state, ...action.payload };
    case FB_DATA_REQUEST:
      return { ...state, requestingData: true };
    case FB_DATA_REQUESTED: {
      const fbinfo = action.payload;
      return { ...state, fbinfo, requestingData: false };
    }
    default:
      return state;
  }
}
