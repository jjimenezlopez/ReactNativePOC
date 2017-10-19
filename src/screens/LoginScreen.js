import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import * as actions from '../actions';

class LoginScreen extends Component {
  state = {
    username: '',
    avatar: '',
    errorUsernameRequired: false
  };

  componentDidMount() {
    if (this.props.username) {
      this.props.navigation.navigate('recording');
    }
  }

  async login() {
    this.setState({ errorUsernameRequired: this.state.username === '' });
    try {
      await this.props.login();
      this.props.navigation.navigate('recording');
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
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <FormLabel>Tell me your name</FormLabel>
          <FormInput onChange={(username) => { this.setState({ username }); }} />
          {this.showUsernameRequired()}
          <FormLabel>Give me your avatar's URL</FormLabel>
          <FormInput onChange={(avatar) => { this.setState({ avatar }); }} />
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

const mapStateToProps = ({ user }) => (
  { username: user.name, avatar: user.avatar, authorizing: user.authorizing }
);

export default connect(mapStateToProps, actions)(LoginScreen);
