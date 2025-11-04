import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePermissions } from "@/hooks/usePermissions";
import { ReduxProvider } from "@/providers/ReduxProvider";
import NativeLocalStorage from "@/specs/NativeSms";
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { permissions, loading, checkPermissions, requestPermissions } =
    usePermissions();
  const [isChecking, setIsChecking] = useState(true);
  // const { HelloModule } = NativeModules;

  // useEffect(() => {
  //   const checkInitialPermissions = async () => {
  //     // Check permissions on initial load
  //     await checkPermissions();
  //     setIsChecking(false);
  //   };

  //   checkInitialPermissions();
  // }, [checkPermissions]);

  // // Show nothing while checking permissions
  // if (isChecking) {
  //   return null;
  // }

  // Determine initial route based on permissions
  // const hasAllPermissions =
  //   permissions.sms && permissions.phoneState && permissions.contacts;

  // const initialRouteName = hasAllPermissions ? "(tabs)/index" : "onboarding";

  useEffect(() => {
    // NativeLocalStorage.sayHello("Abdullah");
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ReduxProvider>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <Stack
          // initialRouteName={initialRouteName}
          >
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
      </ReduxProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
