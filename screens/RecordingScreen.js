import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Sound from 'react-native-sound';
import AudioRecording from '../components/AudioRecording';

import * as actions from '../actions';

class RecordingScreen extends React.Component {
  state = {
    recording: false,
    playing: false,
    recordURI: null,
    duration: 0
  };

  componentDidMount() {
    Sound.setCategory('Playback');
  }

  onRecording = () => {
    this.setState({ recording: true });
  }

  onStopRecording = (uri, duration) => {
    this.setState({ recording: false, recordURI: uri, duration: this.formatSeconds(duration) });
    // this.props.uploadRecording(uri);
  }


  formatSeconds(seconds) {
    return `${Math.floor(seconds / 60)}:${('0' + seconds % 60).slice(-2)}`; // eslint-disable-line
  }

  playRecording = async () => {
    const sound = new Sound(this.state.recordURI, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log(error);
      }

      console.log(`sound loaded: ${sound.getDuration()}`);
    });
  }

  renderBigMic = () => {
    if (this.state.recording) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Icon name='mic' size={220} color='#adadad' />
          <Text style={{ color: '#adadad', fontSize: 18 }}>Habla ahora...</Text>
        </View>
      );
    }
  }

  renderPlayButton() {
    console.log(this.state.recordURI);
    console.log(this.state.recording);
    if (this.state.recordURI && !this.state.recording) {
      return (
        <Button
          large
          raised
          disabled={this.state.playing}
          backgroundColor='#517fa4'
          title={`Reproducir (${this.state.duration})`}
          onPress={this.playRecording}
          icon={{ name: 'play-arrow' }}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          {this.renderBigMic()}
          {this.renderPlayButton()}
        </View>
        <View style={styles.bottomView}>
          <Text style={styles.infoText}>Mantén pulsado el micrófono para grabar</Text>
          <AudioRecording
            onRecording={this.onRecording}
            onStopRecording={this.onStopRecording}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: { marginBottom: 10 }
});

export default connect(null, actions)(RecordingScreen);
