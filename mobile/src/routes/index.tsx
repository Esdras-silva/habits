import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { SignIn } from "../screens/SignIn";
import * as Notifications from 'expo-notifications';

import { AppRoutes } from "./app.routes";
import { useEffect } from "react";






export function Routes() {

  const { user } = useAuth()

async function schedulePushNotification() {
  const schedule = await Notifications.getAllScheduledNotificationsAsync();
  console.log("Agendadas: ", schedule);

  if (schedule.length > 0) {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  const trigger = new Date(Date.now());
  trigger.setHours(trigger.getHours() + 5);
  trigger.setSeconds(0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Olá, ${user.name}`,
      body: "Você praticou seus hábitos hoje?"
    },
    trigger
  });
}

  useEffect(()=>{
    schedulePushNotification()
  },[])
 
  return (
    <View className="flex-1 bg-background">
      <NavigationContainer>
      {user.name ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </View>
  )
}