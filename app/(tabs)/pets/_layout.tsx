import { Stack } from 'expo-router';

export default function PetsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: true,
          title: 'My Pets',
        }}
      />
      <Stack.Screen 
        name="add"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Add New Pet',
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{
          headerShown: true,
          title: 'Pet Profile',
        }}
      />
      <Stack.Screen 
        name="pedigree"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Pedigree',
        }}
      />
    </Stack>
  );
}
