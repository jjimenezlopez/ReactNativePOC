import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../actions';

import ChatScreen from './ChatScreen';
import LoginScreen from './LoginScreen';


class InitialScreen extends Component {
  async componentWillMount() {
    this.props.getUserID();
  }

  getInitialScreen() {
    if (_.isUndefined(this.props.uid)) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator />
        </View>
      );
    } else if (_.isNull(this.props.uid)) {
      return <LoginScreen navigation={this.props.navigation} />;
    }

    return <ChatScreen navigation={this.props.navigation} />;
  }

  render() {
    return (
      this.getInitialScreen()
    );
  }
}

const mapStateToProps = ({ user }) => (
  { uid: user.id }
);

export default connect(mapStateToProps, actions)(InitialScreen);
