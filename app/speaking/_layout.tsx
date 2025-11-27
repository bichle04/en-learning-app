import { Stack } from "expo-router";

export default function SpeakingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="practice" />
      <Stack.Screen name="test" />
      <Stack.Screen name="room" />
    </Stack>
  );
}
