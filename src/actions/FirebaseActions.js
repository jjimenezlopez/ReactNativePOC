/* globals window */
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';

import {
  UPLOAD_RECORDING_SUCCESS,
  UPLOAD_RECORDING_FAILED
} from './types';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const mime = 'audio/x-caf';

// const AUDIO_PATH = 'public_audios/';

const getBlob = async (filename) => {
  const fileUri = Platform.OS === 'ios' ? filename.replace('file://', '') : filename;

  const data = await fs.readFile(fileUri, 'base64');
  const blob = await Blob.build(data, { type: `${mime};BASE64` });

  return blob;
};

export const uploadRecording = (filename) => async (dispatch) => {
  try {
    const blob = await getBlob(filename);
    // const fileNameToUpload = filename.replace(/^.*[\\\/]/, '');
    const fileNameToUpload = filename.replace(/^.*[\\/]/, '');
    const storageRef = firebase.storage().ref();
    const audioRef = storageRef.child(`AUDIO_PATH${fileNameToUpload}`);

    await audioRef.put(blob, { contentType: mime });

    blob.close();
    const downloadUrl = await audioRef.getDownloadUrl();

    dispatch({ type: UPLOAD_RECORDING_SUCCESS });
    console.log(`audio uploaded: ${downloadUrl}`);
  } catch (e) {
    console.error(e);
    console.log('audio not uploaded!');

    dispatch({ type: UPLOAD_RECORDING_FAILED });
  }
};
