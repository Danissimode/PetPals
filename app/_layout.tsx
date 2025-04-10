import { useEffect } from 'react';
 import { Stack } from 'expo-router';
 import { StatusBar } from 'expo-status-bar';
 import { Platform } from 'react-native';
 import { AuthProvider } from '@/providers/AuthProvider'
 import { useFrameworkReady } from '@/hooks/useFrameworkReady';

 declare global {
  interface Window {
  frameworkReady?: () => void;
  }
 }

 export default function RootLayout() {
  useFrameworkReady();
  useEffect(() => {
  if (Platform.OS === 'web') {
  window.frameworkReady?.();
  }
  }, []);

  return (
  <AuthProvider>
  <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="login" options={{ headerShown: false }} />
  <Stack.Screen name="register" options={{ headerShown: false }} />
  <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
  </Stack>
  <StatusBar style="auto" />
  </AuthProvider>
  );
 }
