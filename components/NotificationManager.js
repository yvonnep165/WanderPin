import { View, Text, Button, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { Switch } from '@rneui/themed';
import { colors } from "../styles/Colors";
import React, { useState, useEffect } from 'react';

export const verifyPermission = async () => {
    // ask the user for notification permission
  const status = await Notifications.getPermissionsAsync();
  if (status.granted) {
    return true;
  }
  const response = await Notifications.requestPermissionsAsync({
    ios: { allowBadge: true, allowAlert: true },
  });
  return response.granted;
};

export default function NotificationManager({changedHandler, value}) {
    const [reminder, setReminder] = useState(false);

    useEffect(() => {
        setReminder(value);
    }, [value]);

    function handleReminderSetting(value) {
        setReminder(value)
        changedHandler(value)
        console.log(value);
        // scheduleNotificationHandler()
    }

  const scheduleNotificationHandler = async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give permission to send notification");
        return;
      }
      Notifications.scheduleNotificationAsync({
        content: {
          title: "testing title",
          body: "this is a notification",
        },
        trigger: { seconds: 5 },
      });
    } catch (err) {
      console.log("schedule notification error ", err);
    }
  };

  return (
    <View>
        <Switch
          value={reminder}
          onValueChange={handleReminderSetting}
          color={colors.deepGreen}
        />
    </View>
  );
}