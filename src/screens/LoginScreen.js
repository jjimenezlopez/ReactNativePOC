import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';

import * as actions from '../actions';

class LoginScreen extends Component {
  state = {
    username: '',
    errorUsernameRequired: false
  };

  async login() {
    this.setState({ errorUsernameRequired: this.state.username === '' });
    try {
      await this.props.login();
      this.props.setUserName(this.state.username);
      const navigateAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'recording' })]
      });

      this.props.navigation.dispatch(navigateAction);
    } catch (error) {
      console.error(error);
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
  { username: user.name, authorizing: firebase.authorizing, uid: user.id }
);

export default connect(mapStateToProps, actions)(LoginScreen);
