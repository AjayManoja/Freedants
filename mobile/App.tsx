import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ActivityIndicator, View } from 'react-native';
import { LocaleProvider } from './src/i18n/LocaleContext';
import { CompetitionDetailScreen } from './src/screens/CompetitionDetailScreen';
import { resetDemoData } from './src/api/client';
import { config } from './src/config';
import { colors } from './src/theme';

const queryClient = new QueryClient();

function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [sessionReady, setSessionReady] = useState(!config.resetOnLaunch);

  // Each launch starts from the seeded state when the server runs in demo mode.
  // If it doesn't (or is unreachable), this is a no-op and the app loads as usual.
  useEffect(() => {
    if (!config.resetOnLaunch) return;
    let cancelled = false;
    resetDemoData().finally(() => {
      if (!cancelled) setSessionReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!fontsLoaded || !sessionReady) return <Loading />;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <StatusBar style="dark" />
          <CompetitionDetailScreen slug={config.competitionSlug} />
        </LocaleProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
