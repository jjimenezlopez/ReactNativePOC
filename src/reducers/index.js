import { combineReducers } from 'redux';
import firebase from './FirebaseReducer';
import user from './UserReducer';

export default combineReducers({
  firebase,
  user
});
