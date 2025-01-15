import { Button, StyleSheet, Text, View } from 'react-native'
// import NotificationsProvider from "./app/shared/hooks/NotificationsProvider";
import React from 'react'
import notifee from '@notifee/react-native';
import NotificationsProvider from "./app/shared/hooks/NotificationsProvider";
import messaging from "@react-native-firebase/messaging";

const App = () => {
/*   async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }
  const getFCMToken = async () => {
  
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log("FCM Token:", token); // Imprime el token FCM
      } else {
        console.log("No se pudo obtener el token FCM");
      }
    } catch (error) {
      console.error("Error al obtener el token FCM:", error);
    }
  };
 */

  return (
    
     <NotificationsProvider>
      <View>
           <Button title="Display Notification" onPress={() => {}} />
      </View>
     </NotificationsProvider>
  );
}

export default App

const styles = StyleSheet.create({})