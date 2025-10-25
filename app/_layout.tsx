import { SMSServiceProvider } from "@/contexts/SMSContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePermissions } from "@/hooks/usePermissions";
import { useSocket } from "@/hooks/useWebSocket";
import { ReduxProvider } from "@/providers/ReduxProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const socket = useSocket();
  const { permissions, loading, checkPermissions, requestPermissions } =
    usePermissions();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkInitialPermissions = async () => {
      // Check permissions on initial load
      await checkPermissions();
      setIsChecking(false);
    };

    checkInitialPermissions();
  }, [checkPermissions]);

  // Show nothing while checking permissions
  if (isChecking) {
    return null;
  }

  // Determine initial route based on permissions
  const hasAllPermissions =
    permissions.sms &&
    permissions.phoneState &&
    permissions.storage &&
    permissions.contacts;
  const initialRouteName = hasAllPermissions ? "(tabs)/index" : "onboarding";

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ReduxProvider>
        <WebSocketProvider>
          <SMSServiceProvider>
            <SafeAreaView
              style={{
                flex: 1,
              }}
            >
              <Stack initialRouteName={initialRouteName}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal", title: "Modal" }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{
                    headerShown: false,
                    animation: "fade_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="permissions"
                  options={{
                    headerShown: false,
                    animation: "fade_from_bottom",
                  }}
                />
              </Stack>
            </SafeAreaView>
          </SMSServiceProvider>
        </WebSocketProvider>
      </ReduxProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
