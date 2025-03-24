"use client";

import {
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@/actions/firebase-admin";
import useFirebaseMessaging from "@/hooks/use-firebase-messaging";
import { app } from "@/lib/firebase";
import { getToken, getMessaging } from "firebase/messaging";
import { useState } from "react";

export default function HomePage() {
  const [fcmToken, setFcmToken] = useState<string>("");
  const { isSupported, firebaseServiceWorker } = useFirebaseMessaging();

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Notification permission granted.");

        const messaging = getMessaging(app);

        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: firebaseServiceWorker,
        });

        setFcmToken(fcmToken);

        console.log("FCM Token:", fcmToken);
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
  };

  if (!isSupported) {
    return <div>Push notifications are not supported in this browser.</div>;
  }

  const handleSendLocalNotification = () => {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("Test Notification", {
            body: "Buzz! Buzz!",
            icon: "icon.png",
            silent: false,
            tag: "vibration-sample",
          });
        });
      }
    });
  };

  const handleSubscribeToTopic = async (topic: string) => {
    await subscribeToTopic(fcmToken, topic);
  };

  const handleUnsubscribeFromTopic = async (topic: string) => {
    await unsubscribeFromTopic(fcmToken, topic);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-[500px] bg-base-100 shadow-xl">
        <div className="card-body w-full">
          <p className="card-title h-auto break-all text-sm">
            FCM Token: {fcmToken}
          </p>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleRequestPermission}
            >
              Enable Notifications
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSendLocalNotification}
            >
              Send Local Notification
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-accent"
              onClick={() => handleSubscribeToTopic("dog")}
            >
              Subscribe to Topic: Dog
            </button>
            <button
              className="btn btn-neutral"
              onClick={() => handleUnsubscribeFromTopic("dog")}
            >
              Unsubscribe from Topic: Dog
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-accent"
              onClick={() => handleSubscribeToTopic("cat")}
            >
              Subscribe to Topic: Cat
            </button>
            <button
              className="btn btn-neutral"
              onClick={() => handleUnsubscribeFromTopic("cat")}
            >
              Unsubscribe from Topic: Cat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
