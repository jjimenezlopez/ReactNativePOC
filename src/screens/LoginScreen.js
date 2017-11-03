import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, FormValidationMessage, Button, SocialIcon } from 'react-native-elements';
import * as actions from '../actions';

class LoginScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  state = {
    username: '',
    errorUsernameRequired: false
  };

  async login() {
    this.setState({ errorUsernameRequired: this.state.username === '' });
    try {
      await this.props.login();
      this.props.setUserName(this.state.username);
      this.props.navigator.resetTo({
        screen: 'ReactNativePOC.ChatScreen',
        title: 'Chat',
        animated: true
      });
    } catch (error) {
      console.error(error);
    }
  }

  async loginWithFacebook() {
    try {
      await this.props.loginWithFacebook();
      if (this.props.authorized) {
        await this.props.getUserFBData();
        this.props.setUserName(this.props.fbinfo.name);
        this.props.navigator.resetTo({
          screen: 'ReactNativePOC.ChatScreen',
          title: 'Chat',
          animated: true
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Se ha producido un error en el proceso de login.');
      console.log(error);
    }
  }

  showUsernameRequired() {
    if (!this.state.errorUsernameRequired) {
      return;
    }

    return (
      <FormValidationMessage>{'This field is required'}</FormValidationMessage>
    );
  }

  renderLoginButton() {
    return (
      <Button
        title={this.props.authorizing ? 'Logging in...' : 'Let me in!'}
        style={styles.button}
        onPress={this.login.bind(this)}
        disabled={this.props.authorizing}
      />
    );
  }

  render() {
    console.log(this.props.authorizing);
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <FormLabel>Tell me your name</FormLabel>
          <FormInput onChangeText={(username) => { this.setState({ username }); }} />
          {this.showUsernameRequired()}
          {this.renderLoginButton()}
          <SocialIcon
            title={this.props.authorizing || this.props.requestingData ? 'Logging in...' : 'Sign In With Facebook'}
            button
            type='facebook'
            disabled={this.props.authorizing || this.props.requestingData}
            onPress={this.loginWithFacebook.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: { justifyContent: 'center', flex: 1 },
  form: { justifyContent: 'center' },
  button: { marginTop: 10 }
};

const mapStateToProps = ({ user, firebase }) => (
  {
    username: user.name,
    authorizing: firebase.authorizing,
    authorized: firebase.authorized,
    uid: user.id,
    fbinfo: user.fbinfo,
    requestingData: user.requestingData
  }
);

export default connect(mapStateToProps, actions)(LoginScreen);
