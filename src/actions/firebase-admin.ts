"use server";

import { getMessaging } from "firebase-admin/messaging";
import { app } from "@/lib/firebase-admin";

export const subscribeToTopic = async (fcmToken: string, topic: string) => {
  const messaging = getMessaging(app);
  const response = await messaging.subscribeToTopic([fcmToken], topic);
  console.log("Subscribe to topic response:", response);
};

export const unsubscribeFromTopic = async (fcmToken: string, topic: string) => {
  const messaging = getMessaging(app);
  const response = await messaging.unsubscribeFromTopic([fcmToken], topic);
  console.log("Unsubscribe from topic response:", response);
};
