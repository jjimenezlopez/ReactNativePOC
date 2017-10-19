import { combineReducers } from 'redux';

import {
  START_FETCHING_MESSAGES,
  RECEIVED_MESSAGES,
  UPDATE_MESSAGES_HEIGHT
} from '../actions/types';

const INITIAL_STATE = {};

const meta = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case START_FETCHING_MESSAGES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVED_MESSAGES:
      return Object.assign({}, state, {
        isFetching: false,
        lastFetched: action.receivedAt
      });
    case UPDATE_MESSAGES_HEIGHT:
      return Object.assign({}, state, {
        height: action.height
      });
    default:
      return state;
  }
};

const chatroom = combineReducers({
  messages,
  meta
});
