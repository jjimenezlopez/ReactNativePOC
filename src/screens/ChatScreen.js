import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';
import * as actions from '../actions';

class ChatScreen extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Logout', // for a textual button, provide the button title (label)
        id: 'logout'
      }
    ]
  };

  static navigatorStyle = {
    navBarHidden: false,
    statusBarColor: '#36648B',
    statusBarTextColorScheme: 'light',
    navBarBackgroundColor: '#517fa4',
    navBarTextColor: 'white',
    navBarButtonColor: 'white',
    topBarElevationShadowEnabled: true,
    navBarHideOnScroll: false
  };

  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    this.props.getUserData();
    this.props.fetchMessages();
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'logout') { // this is the same id field from the static navigatorButtons definition
        this.logout();
      }
    }
  }

  async logout() {
    await this.props.logout();
    this.props.navigator.resetTo({
      screen: 'ReactNativePOC.LoginScreen',
      animated: true
    });
  }

  async sendMessage(messages) {
    const text = messages[0].text;
    const message = {
      user: {
        _id: this.props.id,
        name: this.props.name
      },
      type: 'text',
      text,
      createdAt: new Date()
    };

    await this.props.sendMessage(message);
  }

  renderCustomActions(props) {
    const options = {
      'Send audio': () => {
        this.props.navigator.showModal({
          screen: 'ReactNativePOC.RecordingScreen',
          title: 'Audio recording'
        });
      },
      Cancel: () => {},
    };

    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  render() {
    if (this.props.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={(messages) => this.sendMessage(messages)}
        renderActions={this.renderCustomActions.bind(this)}
        user={{
          _id: this.props.id,
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { messages, loading } = state.firebase;
  const { name, id, authorized } = state.user;
  return { messages, id, name, authorized, loading };
};

export default connect(mapStateToProps, actions)(ChatScreen);
