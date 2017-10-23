/* globals window */
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '../services/firebase';

import {
  UPLOAD_RECORDING_SUCCESS,
  UPLOAD_RECORDING_FAILED,
  USER_START_AUTHORIZING,
  USER_AUTHORIZED,
  USER_AUTHORIZATION_ERROR,
  USER_SIGNED_OUT,
  MESSAGE_SENT,
  SEND_MESSAGE_ERROR
} from './types';

import { AUDIO_PATH } from '../constants';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const AAC_MIME = 'audio/aac';

const FIREBASE_AUDIO_PATH = 'public_audios/';

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
    const downloadUrl = await audioRef.getDownloadURL();

    dispatch({ type: UPLOAD_RECORDING_SUCCESS });
    console.log(`audio uploaded: ${downloadUrl}`);
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

export const logout = () => async dispatch => {
  try {
    await firebase.auth().signOut();
    dispatch({ type: USER_SIGNED_OUT });
  } catch (error) {
    console.error(error);
  }
};
