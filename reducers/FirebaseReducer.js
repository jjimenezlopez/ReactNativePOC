import {
  UPLOAD_RECORDING_SUCCESS,
  UPLOAD_RECORDING_FAILED
} from '../actions/types';

const INITIAL_STATE = [];

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPLOAD_RECORDING_SUCCESS:
      return action.payload;
    case UPLOAD_RECORDING_FAILED:
      return action.payload;
    default:
      return state;
  }
}
