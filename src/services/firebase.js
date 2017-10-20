import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

import {
  USER_UID
} from '../constants';

const config = {
  apiKey: 'test',
  authDomain: 'test',
  databaseURL: 'test',
  projectId: 'test',
  storageBucket: 'test',
  messagingSenderId: 'test'
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    await AsyncStorage.setItem(USER_UID, user.uid);
  } else {
    await AsyncStorage.removeItem(USER_UID);
  }
});

export default firebase;
