import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Sound from 'react-native-sound';
import AudioRecording from '../components/AudioRecording';

import { AUDIO_PATH } from '../constants';
import * as actions from '../actions';

class RecordingScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  state = {
    recording: false,
    sending: false,
    filename: '',
    duration: 0
  };


  async componentDidMount() {
    Sound.setCategory('Playback');
    this.props.getUserData();
  }

  onRecording = () => {
    this.setState({ recording: true });
  }

  onStopRecording = async (filename) => {
    this.setState({
      recording: false,
      sending: true,
      filename
    });

    if (this.sound) {
      this.sound.release();
    }

    this.sound = new Sound(this.state.filename, AUDIO_PATH, (error) => {
      if (error) {
        console.error(error);
      }

      this.setState({ duration: this.formatSeconds(Math.floor(this.sound.getDuration())) });
      console.log(`sound loaded: ${this.sound.getDuration()}`);
    });

    await this.props.uploadRecording(filename);
    await this.sendMessage(filename);
    this.setState({ sending: false });
    this.dismissModal();
  }

  async sendMessage(filename) {
    const message = {
      user: {
        _id: this.props.id,
        name: this.props.username
      },
      type: 'audio',
      filename,
      createdAt: new Date()
    };
    await this.props.sendMessage(message);
  }

  formatSeconds(seconds) {
    return `${Math.floor(seconds / 60)}:${('0' + seconds % 60).slice(-2)}`; // eslint-disable-line
  }

  // deprecated
  playRecording = async () => {
    this.setState({ playing: true });

    this.sound.play((success) => {
      if (success) {
        console.log('successfully finished playing');
        this.setState({ playing: false });
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  }

  dismissModal() {
    this.props.navigator.dismissModal();
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

  renderSending() {
    if (this.state.sending) {
      return (
        <ActivityIndicator />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <TouchableWithoutFeedback onPress={this.dismissModal.bind(this)}>
            <View>
              <Text style={styles.cancelLink}>Cancel</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.topView}>
          {this.renderBigMic()}
          {this.renderSending()}
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
  headerView: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    marginTop: 25,
    marginRight: 30
  },
  cancelLink: {
    fontSize: 16,
    color: '#007AFF'
  },
  topView: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  infoText: { marginBottom: 10 }
});

const mapStateToProps = (state) => (
  {
    username: state.user.name,
    authorized: state.user.authorized,
    id: state.user.id,
    loading: state.firebase.loading,
    messages: state.firebase.messages
  }
);

export default connect(mapStateToProps, actions)(RecordingScreen);
