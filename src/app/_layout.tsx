import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/js-stack';
import { StatusBar } from 'expo-status-bar';

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
        <StatusBar style="light" />
        <Stack
          detachInactiveScreens={false}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
            cardOverlayEnabled: false,
          }}
        />
      </ThemeProvider>
    </LanguageProvider>
  );
}
