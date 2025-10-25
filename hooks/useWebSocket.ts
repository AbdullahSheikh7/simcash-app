import { useEffect } from "react";
import io from "socket.io-client";
import * as IntentLauncher from "expo-intent-launcher";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";

const BACKEND_URL = "https://simcash.vercel.app";

export const useSocket = () => {
  useEffect(() => {
    // generate unique id for this device
    const deviceId = `${"unknown"}_${Math.floor(Math.random() * 9999)}`;

    const socket = io(BACKEND_URL, {
      transports: ["websocket"],
      query: { deviceId },
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to backend:", deviceId);
    });

    // Listen for backend "send_sms" event
    socket.on(
      "send_sms",
      async ({ phone, body }: { phone: string; body: any }) => {
        console.log("📩 Request to send SMS: ", phone, body);

        try {
          // if (Platform.OS === "android") {
          //   await IntentLauncher.startActivityAsync(
          //     "android.intent.action.SENDTO",
          //     {
          //       data: `smsto:${phone}`,
          //       extra: {
          //         sms_body: body,
          //       },
          //     }
          //   );
          // }
          Alert.alert(body);
        } catch (err) {
          console.error("Failed to open SMS intent:", err);
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);
};
