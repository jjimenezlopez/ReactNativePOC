import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import * as actions from '../actions';

class ChatScreen extends Component {
  componentWillMount() {
    this.props.getUserName();
    this.props.fetchMessages();
  }

  async sendMessage(messages) {
    const text = messages[0].text;
    const message = {
      user: {
        _id: this.props.id,
        name: this.props.name
      },
      text,
      timestamp: Date.now(),
      createdAt: new Date()
    };

    console.log(message);
    await this.props.sendMessage(message);
  }

  render() {
    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={(messages) => this.sendMessage(messages)}
        user={{
          _id: this.props.id,
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  const { messages } = state.firebase;
  const { name, id, authorized } = state.user;
  return { messages, id, name, authorized };
};

export default connect(mapStateToProps, actions)(ChatScreen);
