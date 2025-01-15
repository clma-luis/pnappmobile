import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [channelID, setchannelID] = useState('');

  // Crear canal de notificación solo una vez
  const createNotificationChannel = async () => {
    console.log('Creando canal de notificación', channelID);
    notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
    setchannelID(channelId); // Almacena el canal para usarlo después
  };

  // Mostrar la notificación
  const displayNotification = async () => {
    console.log('Mostrando notificación', {channelID});

    notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
        importance: AndroidImportance.HIGH,
        ongoing: false,
        autoCancel: true,
      },
    });
  };

  // Solicitar permisos de notificación
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    requestNotificationPermission();
  }

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission for notifications was denied');
      } else {
        console.log('Permission for notifications granted');
      }
    }
  }

  // Obtener FCM token
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

  useEffect(() => {
    requestUserPermission();
    createNotificationChannel(); // Crear el canal una sola vez
    getFCMToken();
  }, []); // Solo ejecutarse al montar el componente

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      displayNotification(); // Mostrar notificación cuando se recibe un mensaje
    });

    return unsubscribe;
  }, []);

  return children;
};

export default NotificationsProvider;
