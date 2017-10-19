import { combineReducers } from 'redux';
import firebaseReducer from './FirebaseReducer';
import user from './UserReducer';

export default combineReducers({
  firebaseReducer,
  user
});
