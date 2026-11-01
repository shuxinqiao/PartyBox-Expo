import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/js-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LanguageProvider } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

const partyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.background,
  },
};

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider value={partyTheme}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar style="light" />
          <Stack
            detachInactiveScreens={false}
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: COLORS.background },
              animation: 'slide_from_right',
              cardOverlayEnabled: false,
            }}>
            <Stack.Screen name="wavelength" options={{ gestureEnabled: false }} />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </LanguageProvider>
  );
}
