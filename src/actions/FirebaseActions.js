/* globals window */
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '../services/firebase';

import {
  UPLOAD_RECORDING_SUCCESS,
  UPLOAD_RECORDING_FAILED
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
