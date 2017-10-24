/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import RecordingScreen from './screens/RecordingScreen';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('ReactNativePOC.LoginScreen', () => LoginScreen, store, Provider);
	Navigation.registerComponent('ReactNativePOC.ChatScreen', () => ChatScreen, store, Provider);
	Navigation.registerComponent('ReactNativePOC.RecordingScreen', () => RecordingScreen, store, Provider);
}
