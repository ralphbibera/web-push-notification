"use client";

import { app, firebaseConfig } from "@/lib/firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";

export default function useFirebaseMessaging() {
  const [isSupported, setIsSupported] = useState(false);
  const [firebaseServiceWorker, setFirebaseServiceWorker] =
    useState<ServiceWorkerRegistration>();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      setIsSupported(true);
      registerServiceWorker();
      const messaging = getMessaging(app);
      onMessage(messaging, (payload) => {
        console.log("Received foreground message:", payload);
      });
    }
  }, []);

  const registerServiceWorker = async () => {
    const registration = await navigator.serviceWorker.register(
      buildFirebaseMessagingUrl()
    );
    setFirebaseServiceWorker(registration);
  };

  return {
    isSupported,
    firebaseServiceWorker,
  };
}

const buildFirebaseMessagingUrl = () => {
  let url = "/firebase-messaging-sw.js";

  Object.entries(firebaseConfig).forEach(([key, value], index) => {
    url += `${index === 0 ? "?" : "&"}${key}=${value}`;
  });

  return url;
};
