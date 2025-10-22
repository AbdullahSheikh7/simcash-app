import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { SMSServiceProvider } from '@/contexts/SMSContext';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { WebSocketProvider } from '@/contexts/WebSocketContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { permissions, loading } = usePermissions();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  // Show nothing while checking permissions
  if (isChecking) {
    return null;
  }

  // Determine initial route based on permissions
  const hasAllPermissions = permissions.sms && permissions.phoneState && permissions.storage;
  const initialRouteName = hasAllPermissions ? '(tabs)/index' : 'onboarding';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReduxProvider>
        <WebSocketProvider>
          <SMSServiceProvider>
            <Stack initialRouteName={initialRouteName}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            </Stack>
          </SMSServiceProvider>
        </WebSocketProvider>
      </ReduxProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
