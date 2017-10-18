import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { StyleSheet, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
import reducers from './src/reducers';
import RecordingScreen from './src/screens/RecordingScreen';

export default class App extends React.Component {
  constructor() {
    super();

    const config = {
      apiKey: 'test',
      authDomain: 'test',
      databaseURL: 'test',
      projectId: 'test',
      storageBucket: 'test',
      messagingSenderId: 'test'
    };

    firebase.initializeApp(config);
  }

  render() {
    const MainNavigator = StackNavigator({
      main: { screen: RecordingScreen }
    }, {
      headerMode: 'none'
    });

    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
