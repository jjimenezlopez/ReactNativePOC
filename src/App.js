import _ from 'lodash';
import React from 'react';
import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './screens';
import reducers from './reducers';

import {
  USER_UID
} from './constants';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

registerScreens(store, Provider);

export default class App extends React.Component {
  constructor() {
    super();
    this.startApp();
  }

  async getUserID() {
    this.userId = await AsyncStorage.getItem(USER_UID);
  }

  loginScreen() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'ReactNativePOC.LoginScreen',
        title: 'Login'
      }
    });
  }

  chatScreen() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'ReactNativePOC.ChatScreen',
        title: 'Chat'
      }
    });
  }

  async startApp() {
    await this.getUserID();
    console.log(`userId: ${this.userId}`);
    if (_.isNull(this.userId)) {
      this.loginScreen();
    } else {
      this.chatScreen();
    }
  }
}
