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
    subscribeForNotifications();
    registerNotificationEvents();
  } else {
    await AsyncStorage.removeItem(USER_UID);
    unsubscribeForNotifications();
  }
});

const subscribeForNotifications = () => {
  try {
    FCM.requestPermissions();
    FCM.subscribeToTopic(NOTIFICATIONS_TOPIC);

    FCM.on(FCMEvent.RefreshToken, newToken => {
      console.log(newToken);
    });
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
        default:
          notif.finish();
      }
    }
  });
};

export default firebase;
