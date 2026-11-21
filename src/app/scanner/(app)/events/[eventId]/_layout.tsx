import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { HeaderButton } from '@/shared/ui';

function tabIcon(name: SymbolViewProps['name']) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <SymbolView name={name} size={size} tintColor={color} />;
  };
}

export default function EventLayout() {
  return (
    <Tabs
      screenOptions={{
        // The event's tabs replace the stack header, so they need their own way back.
        headerLeft: () => <HeaderButton label="‹ Events" onPress={() => router.dismissTo('/')} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: tabIcon({ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: tabIcon({ ios: 'qrcode.viewfinder', android: 'qr_code_scanner', web: 'qr_code_scanner' }),
        }}
      />
      <Tabs.Screen
        name="attendees"
        options={{
          title: 'Attendees',
          headerShown: false,
          tabBarIcon: tabIcon({ ios: 'person.2', android: 'group', web: 'group' }),
        }}
      />
      <Tabs.Screen
        name="check-ins"
        options={{
          title: 'Check-ins',
          tabBarIcon: tabIcon({ ios: 'checklist', android: 'checklist', web: 'checklist' }),
        }}
      />
    </Tabs>
  );
}
