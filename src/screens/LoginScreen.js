import React, { Component } from 'react';
import { View, Alert, Text } from 'react-native';
import { connect } from 'react-redux';
import { FormValidationMessage, Button, SocialIcon } from 'react-native-elements';
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

  async loginWithGoogle() {
    try {
      await this.props.loginWithGoogle();
      if (this.props.authorized) {
        this.props.setUserData(this.props.googleinfo);
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
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.loginText}>Por favor, haz login usando alguna de estas opciones.</Text>
          <View style={styles.socialButtonWrapper}>
            <View style={styles.socialButtonContainer}>
              <SocialIcon
                title={this.props.fbauthorizing || this.props.requestingData ? 'Signing in...' : 'Sign In With Facebook'}
                button
                type='facebook'
                disabled={this.props.fbauthorizing || this.props.requestingData}
                onPress={this.loginWithFacebook.bind(this)}
                style={styles.socialButton}
              />
              <SocialIcon
                title={this.props.googleauthorizing || this.props.requestingData ? 'Signing in...' : 'Sign In With Google'}
                button
                type='google-plus-official'
                disabled={this.props.googleauthorizing || this.props.requestingData}
                onPress={this.loginWithGoogle.bind(this)}
                style={styles.socialButton}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1 },
  form: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  button: { marginTop: 10 },
  socialButtonWrapper: { flexDirection: 'row' },
  socialButtonContainer: { flex: 1 },
  socialButton: { marginTop: 10, marginLeft: 14, marginRight: 14 },
  loginText: { color: '#7e7e7e', textAlign: 'center', alignSelf: 'center', margin: 20 }
};

const mapStateToProps = ({ user, firebase }) => {
  console.log(firebase);
  return {
    username: user.name,
    authorizing: firebase.authorizing,
    fbauthorizing: firebase.fbauthorizing,
    googleauthorizing: firebase.googleauthorizing,
    authorized: firebase.authorized,
    uid: user.id,
    fbinfo: user.fbinfo,
    requestingData: user.requestingData,
    googleinfo: firebase.googleinfo
  };
};

export default connect(mapStateToProps, actions)(LoginScreen);
