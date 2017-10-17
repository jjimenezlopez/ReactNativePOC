import React, { Component } from 'react';
import { 
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid,
  Alert } from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { Icon } from 'react-native-elements';

const AUDIO_PATH = `${AudioUtils.DocumentDirectoryPath}/`;

export default class AudioRecording extends Component {
  state = {
    buttonPressed: false,
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    finished: false,
    hasPermission: undefined
  };

  async componentDidMount() {
    this.checkPermission()
      .then((hasPermission) => {
        this.setState({ hasPermission });

        if (!hasPermission) return;

        this.prepareRecordingPath(`${AUDIO_PATH}${this.randomName()}.aac`);

        AudioRecorder.onProgress = (data) => {
          this.setState({ currentTime: Math.floor(data.currentTime) });
        };

        AudioRecorder.onFinished = (data) => {
          // Android callback comes in the form of a promise instead.
          if (Platform.OS === 'ios') {
            this.finishRecording(data.status === 'OK', data.audioFileURL);
          }
        };
      });
  }

  incrementer = null;
  recorder = null;
  recordURI = null;

  randomName() {
    return Math.random().toString(36).substring(7);
  }

  prepareRecordingPath(filename) {
    AudioRecorder.prepareRecordingAtPath(filename, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000
    });
  }

  checkPermission() {
   if (Platform.OS !== 'android') {
     return Promise.resolve(true);
   }

   const rationale = {
     title: 'Microphone Permission',
     message: 'This app needs access to your microphone so you can record audio.'
   };

   return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
     .then((result) => {
       console.log('Permission result:', result);
       return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
     });
  }

  finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed });
    this.props.onStopRecording(filePath, this.state.currentTime);
    this.prepareRecordingPath(`${AUDIO_PATH}${this.randomName()}.aac`);
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`); // eslint-disable-line
  }

  async record() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      Alert.alert('Error', 'Can\'t record, no permission granted!');
      return;
    }

    this.setState({ recording: true });

    try {
      await AudioRecorder.startRecording();
      console.log('recording');
    } catch (error) {
      console.error(error);
    }
  }

  async stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({ stoppedRecording: true, recording: false });

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this.finishRecording(true, filePath);
      }

      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  formatSeconds(seconds) {
    return `${Math.floor(seconds / 60)}:${('0' + seconds % 60).slice(-2)}`; // eslint-disable-line
  }

  buttonPressed = async () => {
    this.setState({ pressed: true });
    this.record();
    this.props.onRecording();
  }

  buttonReleased = async () => {
    this.setState({ pressed: false });
    this.stop();
  }

  showSeconds() {
    if (this.state.recording) {
      return <Text style={{ fontSize: 18 }}>{this.formatSeconds(this.state.currentTime)}</Text>;
    }
  }

  render() {
    return (
      <View style={{ justifyContent: 'space-around' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {this.showSeconds()}
        </View>
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPressIn={this.buttonPressed}
            onPressOut={this.buttonReleased}
          >
            <View>
              <Icon
                reverse
                raised={!this.state.pressed}
                name='mic'
                color='#517fa4'
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}
