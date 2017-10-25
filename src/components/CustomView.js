import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import Sound from 'react-native-sound';

import * as actions from '../actions';

import { DOWNLOADS_PATH } from '../constants';

class CustomView extends Component {
  state = {
    downloadingFileId: null
  }

  async downloadFile(messageId, url, filename) {
    this.setState({ downloadingFileId: messageId });

    await RNFetchBlob
      .config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        path: `${DOWNLOADS_PATH}${filename}`,
        appendExt: 'aac'
      })
      .fetch('GET', url);

    this.setState({ downloadingFileId: null });
  }

  async playRecording(messageId, url, filename) {
    await this.downloadFile(messageId, url, filename);

    this.setState({ playing: true });

    const sound = new Sound(filename, DOWNLOADS_PATH, (error) => {
      if (error) {
        console.error(error);
      }
      console.log('sound loaded');
      sound.play(() => {
        this.setState({ playing: false });
        sound.release();
      });
    });
  }

  renderDownloadSpinner(messageId) {
    const messageUserId = this.props.currentMessage.user._id; // eslint-disable-line
    let color = '#000';

    if (this.props.id === messageUserId) {
      color = '#fff';
    }

    if (messageId === this.state.downloadingFileId) {
      return <View style={{ marginRight: 8 }}><ActivityIndicator color={color} /></View>;
    }

    return null;
  }

  renderAudioText(messageUserId) {
    if (messageUserId === this.props.id) {
      return <Text style={styles.myAudioMessage}>Audio message</Text>;
    }

    return <Text style={styles.theirAudioMessage}>Audio message</Text>;
  }

  renderPlayButton() {
    const messageUserId = this.props.currentMessage.user._id; // eslint-disable-line
    let color = '#000';

    if (this.props.id === messageUserId) {
      color = '#fff';
    }

    if (!this.state.downloadingFileId) {
      return (<Icon
        name='play-arrow'
        color={color}
        iconStyle={styles.iconStyle}
      />);
    }
  }

  renderAudioMessage() {
    const messageUserId = this.props.currentMessage.user._id; // eslint-disable-line
    const messageId = this.props.currentMessage._id; // eslint-disable-line

    return (
      <View>
        <TouchableWithoutFeedback
          onPress={this.playRecording.bind(this, messageId, this.props.currentMessage.audioUrl, this.props.currentMessage.audioFilename)}
        >
          <View style={styles.audioMessage}>
            {this.renderDownloadSpinner(messageId)}
            {this.renderPlayButton()}
            {this.renderAudioText(messageUserId)}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    if (this.props.currentMessage.type === 'audio') {
      return this.renderAudioMessage();
    }

    return null;
  }
}


const styles = {
  audioMessage: {
    marginLeft: 8,
    marginTop: 8,
    marginRight: 8,
    flexDirection: 'row'
  },
  iconStyle: {
    marginRight: 5
  },
  myAudioMessage: {
    color: '#fff'
  },
  theirAudioMessage: {
    color: '#000'
  }
};

const mapStateToProps = state => (
  { id: state.user.id }
);

export default connect(mapStateToProps, actions)(CustomView);
