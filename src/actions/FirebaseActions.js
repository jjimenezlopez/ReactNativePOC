/* globals window */
import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from '../services/firebase';

import {
  UPLOAD_RECORDING_SUCCESS,
  UPLOAD_RECORDING_FAILED,
  USER_START_AUTHORIZING,
  USER_AUTHORIZED,
  USER_AUTHORIZATION_ERROR,
  USER_SIGNED_OUT,
  MESSAGE_SENT,
  SEND_MESSAGE_ERROR,
  START_MESSAGES_FETCH,
  END_MESSAGES_FETCH,
  FETCH_MESSAGES_ERROR,
  NEW_MESSAGE,
  NEW_MESSAGE_ERROR,
  NO_MORE_MESSAGES,
  DISCONNECTED_LISTENING_MESSAGES,
  FB_LOGIN_SUCCESS,
  FB_LOGIN_CANCELED,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_CANCELED
} from './types';

import { AUDIO_PATH } from '../constants';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const AAC_MIME = 'audio/aac';

const FIREBASE_AUDIO_PATH = 'public_audios/';

GoogleSignin.configure({
  iosClientId: 'secret'
});

const getBlob = async (filename) => {
  console.log(`getBlob: ${filename}`);

  const fileUri = `${AUDIO_PATH}${filename}`;

  const data = await fs.readFile(fileUri, 'base64');
  const blob = await Blob.build(data, { type: `${AAC_MIME};BASE64` });

  return blob;
};

// UPLOAD RECORDINGS
export const uploadRecording = (filename) => async (dispatch) => {
  try {
    console.log(`uploadRecording: ${filename}`);
    const blob = await getBlob(filename);
    // const fileNameToUpload = filename.replace(/^.*[\\\/]/, '');
    const storageRef = firebase.storage().ref();
    const audioRef = storageRef.child(`${FIREBASE_AUDIO_PATH}${filename}`);

    await audioRef.put(blob, { contentType: AAC_MIME });

    blob.close();
    const metadata = await audioRef.getMetadata();
    const audioUrl = await audioRef.getDownloadURL();
    const audioFilename = await metadata.name;

    dispatch({ type: UPLOAD_RECORDING_SUCCESS, payload: { audioUrl, audioFilename } });
    console.log(`audio uploaded: ${audioUrl}`);
  } catch (e) {
    console.error(e);
    console.log('audio not uploaded!');

    dispatch({ type: UPLOAD_RECORDING_FAILED });
  }
};

// CHAT MESSAGES
export const sendMessage = (message) => async dispatch => {
  try {
    console.log('sending message');
    firebase.database().ref('messages').push(message);

    dispatch({ type: MESSAGE_SENT, payload: message });
  } catch (error) {
    console.error(error);
    dispatch({ type: SEND_MESSAGE_ERROR });
  }
};

export const fetchMessages = (lastId) => async dispatch => {
  try {
    let ref = firebase.database().ref('messages').orderByKey();

    if (!lastId) {
      // Used to show loading spinner when no previous messages
      dispatch({ type: START_MESSAGES_FETCH });
    }

    if (lastId) {
      ref = ref.endAt(lastId);
    }

    ref.limitToLast(20)
      .once('value', (snapshot) => {
        const messagesObject = snapshot.val();
        const messages = !_.isNull(messagesObject) ? Object.keys(messagesObject)
          .map((key) => ({ ...messagesObject[key], _id: key, key })) : [];

        if (lastId) {
          messages.pop();
        }

        if (messages.length) {
          dispatch({ type: END_MESSAGES_FETCH, payload: { messages: messages.reverse() } });
        }

        if (!messages.length || messages.length < 19) {
          dispatch({ type: NO_MORE_MESSAGES });
        }
      });
  } catch (error) {
    console.error(error);
    dispatch({ type: FETCH_MESSAGES_ERROR });
  }
};

export const listenMessages = () => async dispatch => {
  try {
    firebase.database().ref('messages').orderByChild('createdAt').startAt(Date.now())
      .on('child_added', (child) => {
        console.log('New message received');
        const newMessage = child.val();
        newMessage._id = child.key; // eslint-disable-line
        dispatch({ type: NEW_MESSAGE, payload: { newMessage } });
      });
  } catch (error) {
    console.error(error);
    dispatch({ type: NEW_MESSAGE_ERROR });
  }
};

export const disconnectListenMessages = () => dispatch => {
  try {
    firebase.database().ref('messages').off('child_added');
    dispatch({ type: DISCONNECTED_LISTENING_MESSAGES });
  } catch (error) {
    console.log(error);
  }
};

// LOGIN
export const login = () => async dispatch => {
  try {
    dispatch({ type: USER_START_AUTHORIZING });

    await firebase.auth().signInAnonymously();
    dispatch({ type: USER_AUTHORIZED });
  } catch (error) {
    console.log(error);
    dispatch({ type: USER_AUTHORIZATION_ERROR });
  }
};

export const loginWithFacebook = () => async dispatch => {
  try {
    dispatch({ type: USER_START_AUTHORIZING });
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      console.log('login canceled');
      dispatch({ type: FB_LOGIN_CANCELED });
    } else {
      console.log('Login success');
      const accessTokenData = await AccessToken.getCurrentAccessToken();
      const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken);
      await firebase.auth().signInWithCredential(credential);
      dispatch({ type: FB_LOGIN_SUCCESS });
    }
  } catch (error) {
      console.error(error);
  }
};

export const loginWithGoogle = () => async dispatch => {
  let givenName;
  let photo;
  try {
    dispatch({ type: USER_START_AUTHORIZING });
    await GoogleSignin.hasPlayServices({ autoResolve: true });
    await GoogleSignin.signIn()
      .then((user) => {
        givenName = user.givenName;
        photo = user.photo;
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = provider.credential(user.idToken, user.accessToken);
        return firebase.auth().signInWithCredential(credential);
      }).then(() => {
        dispatch({ type: GOOGLE_LOGIN_SUCCESS, payload: { name: givenName, avatar: photo } });
      })
      .catch((error) => {
        dispatch({ type: GOOGLE_LOGIN_CANCELED });
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    dispatch({ type: GOOGLE_LOGIN_CANCELED });
  }
};

export const logout = () => async dispatch => {
  try {
    await firebase.auth().signOut();
    dispatch({ type: USER_SIGNED_OUT });
  } catch (error) {
    console.error(error);
  }
};
