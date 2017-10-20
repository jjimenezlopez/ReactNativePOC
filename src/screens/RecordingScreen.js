import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Sound from 'react-native-sound';
import AudioRecording from '../components/AudioRecording';

import { AUDIO_PATH } from '../constants';
import * as actions from '../actions';

class RecordingScreen extends React.Component {
  state = {
    recording: false,
    playing: false,
    filename: '',
    duration: 0
  };

  async componentDidMount() {
    Sound.setCategory('Playback');
    this.props.getUserName();
  }

  onRecording = () => {
    this.setState({ recording: true });
  }

  onStopRecording = (filename) => {
    this.setState({
      recording: false,
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

    this.props.uploadRecording(filename);
  }

  formatSeconds(seconds) {
    return `${Math.floor(seconds / 60)}:${('0' + seconds % 60).slice(-2)}`; // eslint-disable-line
  }

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

  async logout() {
    await this.props.logout();
    const navigateAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'login' })]
    });

    this.props.navigation.dispatch(navigateAction);
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
    if (this.state.filename && !this.state.recording) {
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
        <View style={styles.loginInfo}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text>You're logged in as {this.props.username}</Text>
            </View>
            <View style={{ flex: -1, marginRight: 10 }}>
              <Icon
                name='exit-to-app'
                color='#517fa4'
                size={32}
                onPress={this.logout.bind(this)}
              />
            </View>
          </View>
        </View>
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
  loginInfo: { marginTop: 30, flex: 1, flexDirection: 'row' },
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

const mapStateToProps = (state) => {
  console.log(state);

  return {
    username: state.user.name,
    avatar: state.user.avatar,
    authorized: state.user.authorized,
    id: state.user.id
  };
};

export default connect(mapStateToProps, actions)(RecordingScreen);
