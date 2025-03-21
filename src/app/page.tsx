"use client";

import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");

        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (fcmToken) {
          console.log("FCM Token:", fcmToken);
          setToken(fcmToken);
        } else {
          console.log("No registration token available.");
        }
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
  };

  return (
    <div>
      <button
        className="rounded bg-blue-500 p-2 text-white"
        onClick={requestPermission}
      >
        Enable Notifications
      </button>

      {token && (
        <div className="mt-4 bg-gray-200 p-2">
          <p>
            <strong>FCM Token:</strong>
          </p>
          <p className="break-all">{token}</p>
        </div>
      )}
    </div>
  );
}
