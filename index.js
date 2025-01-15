/**
 * @format
 */

import {
  AppRegistry,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App.tsx';

// Manejar mensajes en segundo plano
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Message handled in the background:',
    JSON.stringify(remoteMessage, null, 2),
  );
  if (remoteMessage.notification) {
    await displayNotification(remoteMessage);
  }
});

// Mostrar notificación con alta prioridad usando Notifee
const displayNotification = async remoteMessage => {
  const {notification} = remoteMessage;
  if (notification) {
    await notifee.displayNotification({
      title: notification.title || 'Nuevo mensaje',
      body: notification.body || 'Tienes un nuevo mensaje',
      android: {
        channelId: 'high-priority',
        importance: 4,
        smallIcon: 'ic_launcher',
      },
    });
  }
};

// Verificar y solicitar permisos para notificaciones en Android
const checkAndRequestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    const currentPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (!currentPermission) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission for notifications granted');
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission permanently denied. Redirecting to settings.');
        Alert.alert(
          'Notification Permission Required',
          'You have permanently denied notification permissions. Please enable them in app settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
          ],
        );
      } else {
        console.log('Permission for notifications was denied');
      }
    } else {
      console.log('Notification permission already granted');
    }
  }
};

// Obtener y registrar el token FCM
const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token:', token);
    } else {
      console.log('No se pudo obtener el token FCM');
    }
  } catch (error) {
    console.error('Error al obtener el token FCM:', error);
  }
};

// Inicialización global
(async () => {
  await checkAndRequestNotificationPermission();
  await getFCMToken();
})();

// Registrar el componente principal
AppRegistry.registerComponent(appName, () => App);
