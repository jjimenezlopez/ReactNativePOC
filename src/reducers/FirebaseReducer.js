import _ from 'lodash';
import {
  UPLOAD_RECORDING_SUCCESS,
  // UPLOAD_RECORDING_FAILED
  USER_START_AUTHORIZING,
  FB_START_AUTHORIZING,
  GOOGLE_START_AUTHORIZING,
  USER_AUTHORIZED,
  USER_AUTHORIZATION_ERROR,
  USER_SIGNED_OUT,
  MESSAGE_SENT,
  SEND_MESSAGE_ERROR,
  START_MESSAGES_FETCH,
  END_MESSAGES_FETCH,
  NEW_MESSAGE,
  NO_MORE_MESSAGES,
  FB_LOGIN_SUCCESS,
  FB_LOGIN_CANCELED,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_CANCELED,
  MESSAGE_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
  loadEarlier: true,
  messages: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPLOAD_RECORDING_SUCCESS: {
      const { audioUrl, audioFilename } = action.payload;
      return { ...state, audioUrl, audioFilename };
    }
    case USER_START_AUTHORIZING:
      return { ...state, authorizing: true };
    case FB_START_AUTHORIZING:
      return { ...state, fbauthorizing: true };
    case GOOGLE_START_AUTHORIZING:
      return { ...state, googleauthorizing: true };
    case USER_AUTHORIZED:
      return { ...state, authorizing: false, authorized: true };
    case USER_AUTHORIZATION_ERROR:
      return { ...state, autherror: true };
    case USER_SIGNED_OUT:
      return { ...state, authorized: false };
    case MESSAGE_SENT: {
      const { message } = action.payload;
      return { ...state, message };
    }
    case SEND_MESSAGE_ERROR:
      return { ...state, sendError: true };
    case START_MESSAGES_FETCH:
      return { ...state, loading: true };
    case END_MESSAGES_FETCH: {
      const { messages, clearList } = action.payload;
      const messagesToShow = clearList ? messages : [...state.messages, ...messages];
      return { ...state, loading: false, messages: messagesToShow };
    }
    case NEW_MESSAGE: {
      const { newMessage } = action.payload;
      return { ...state, messages: [newMessage, ...state.messages] };
    }
    case NO_MORE_MESSAGES:
      return { ...state, loading: false, loadEarlier: false };
    case FB_LOGIN_SUCCESS:
      return { ...state, fbauthorizing: false, authorized: true };
    case FB_LOGIN_CANCELED:
      return { ...state, autherror: true, fbauthorizing: false };
    case GOOGLE_LOGIN_SUCCESS:
      return { ...state, googleauthorizing: false, authorized: true, googleinfo: { ...action.payload } };
    case GOOGLE_LOGIN_CANCELED:
      return { ...state, autherror: true, googleauthorizing: false };
    case MESSAGE_CHANGED: {
      const messageChanged = action.payload.message;
      const index = _.findIndex(state.messages, { key: messageChanged.key });
      state.messages.splice(index, 1, messageChanged);
      return { ...state, messages: [...state.messages] };
    }
    default:
      return state;
  }
}
