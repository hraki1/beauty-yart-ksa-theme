// components/Notification.tsx
"use client";

import { useEffect } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";

const Notification = () => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("SW registered");
                    getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration,
                    }).then((currentToken) => {
                        if (currentToken) {
                            console.log("FCM Token:", currentToken);
                            // send token to your server or save 
                            
                        } else {
                            console.warn("No token available");
                        }
                    });
                    onMessage(messaging, (payload) => {
                        alert(`New message: ${payload.notification?.title}`);
                    });
                });
        }
    }, []);

    return null;
};

export default Notification;
