import * as firebase from 'firebase';

const config = {
  apiKey: 'test',
  authDomain: 'test',
  databaseURL: 'test',
  projectId: 'test',
  storageBucket: 'test',
  messagingSenderId: 'test'
};

firebase.initializeApp(config);

export default firebase;
