import { Stack } from 'expo-router';

const modalOptions = {
  presentation: 'modal' as const,
  animation: 'slide_from_bottom' as const,
};

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          ...modalOptions,
          headerShown: true,
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          ...modalOptions,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          ...modalOptions,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
