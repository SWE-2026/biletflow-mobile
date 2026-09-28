import { Tabs } from 'expo-router/js-tabs';

export default function EventLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Overview' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
      <Tabs.Screen name="attendees" options={{ title: 'Attendees', headerShown: false }} />
      <Tabs.Screen name="check-ins" options={{ title: 'Check-ins' }} />
    </Tabs>
  );
}
