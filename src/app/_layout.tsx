import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="restaurants" />
      <Stack.Screen name="new-restaurant" />
      <Stack.Screen name="dishes" />
      <Stack.Screen name="new-dish" />
      <Stack.Screen name="dining-entries" />
      <Stack.Screen name="new-dining-entry" />
      <Stack.Screen name="new-entry" />
      <Stack.Screen name="record-visit" />
      <Stack.Screen name="record-takeout" />
      <Stack.Screen name="dining-statistics" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}