import { AsyncStorage, Platform } from 'react-native';
import * as firebase from 'firebase';
import FCM, { FCMEvent,
              NotificationType,
              WillPresentNotificationResult,
              RemoteNotificationResult
            } from 'react-native-fcm';

import {
  USER_UID,
  NOTIFICATIONS_TOPIC
} from '../constants';

// confic code in repository
const config = {
  apiKey: 'test',
  authDomain: 'test',
  databaseURL: 'test',
  projectId: 'test',
  storageBucket: 'test',
  messagingSenderId: 'test'
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    await AsyncStorage.setItem(USER_UID, user.uid);
    getFCMToken(user.uid);
    subscribeForNotifications();
    registerNotificationEvents();
  } else {
    await AsyncStorage.removeItem(USER_UID);
    unsubscribeForNotifications();
  }
});

const getFCMToken = async (userId) => {
  const token = await FCM.getFCMToken();
  saveToken(userId, token);

  FCM.on(FCMEvent.RefreshToken, newToken => {
    saveToken(userId, newToken);
  });
};

const saveToken = async (userId, token) => {
  const platform = Platform.OS;
  const data = { platform, token };

  firebase.database().ref(`users/${userId}/`).set(data);
};

const subscribeForNotifications = () => {
  try {
    FCM.requestPermissions();
    FCM.subscribeToTopic(NOTIFICATIONS_TOPIC);
  } catch (error) {
    console.error(error);
  }
};

const unsubscribeForNotifications = () => {
  try {
    FCM.unsubscribeFromTopic(NOTIFICATIONS_TOPIC);
  } catch (error) {
    console.log(error);
  }
};

const registerNotificationEvents = () => {
  FCM.on(FCMEvent.Notification, async (notif) => {
    console.log(notif);

    if (Platform.OS === 'ios') {
      switch (notif._notificationType) { // eslint-disable-line
        case NotificationType.Remote:
          //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
          notif.finish(RemoteNotificationResult.NewData);
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
          break;
      }
    }
  });
};

export default firebase;
