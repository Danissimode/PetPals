import { Stack } from 'expo-router';

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
          presentation: 'modal',
          headerShown: true,
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen 
        name="settings"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="password"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
