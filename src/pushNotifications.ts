import PushNotification from 'react-native-push-notification'
import { PushNotificationIOS } from 'react-native'
import { GoogleFirebaseSenderId } from './keys'

class NotificationPermissions {
  Alert: boolean | undefined = false
  Badge: boolean | undefined = false
  Sound: boolean | undefined = false
}

var currentPermissions = new NotificationPermissions()

function configurePushNotifications() {
  PushNotification.checkPermissions(options => {
    // Save permissions in a global state object we can later check in React world
    if (options) {
      currentPermissions.Alert = options.alert
      currentPermissions.Badge = options.badge
      currentPermissions.Sound = options.sound
    }
  })

  PushNotification.configure({
    onRegister: function(token) {
      console.log('TOKEN: ', token)
    },
    onNotification: function(notification) {
      // process the notification
      console.log('NOTIFICATION: ', notification)
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },
    senderID: GoogleFirebaseSenderId,
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  })
}

export { configurePushNotifications, currentPermissions }
