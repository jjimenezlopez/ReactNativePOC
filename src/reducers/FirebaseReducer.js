import {
  UPLOAD_RECORDING_SUCCESS,
  // UPLOAD_RECORDING_FAILED
  USER_START_AUTHORIZING,
  USER_AUTHORIZED,
  USER_AUTHORIZATION_ERROR,
  USER_SIGNED_OUT,
  MESSAGE_SENT,
  SEND_MESSAGE_ERROR,
  START_MESSAGES_FETCH,
  END_MESSAGES_FETCH,
  NEW_MESSAGE,
  NO_MORE_MESSAGES
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
      const { messages } = action.payload;
      return { ...state, loading: false, messages: [...state.messages, ...messages] };
    }
    case NEW_MESSAGE: {
      const { newMessage } = action.payload;

      return { ...state, messages: [newMessage, ...state.messages] };
    }
    case NO_MORE_MESSAGES:
      return { ...state, loadEarlier: false };
    default:
      return state;
  }
}
