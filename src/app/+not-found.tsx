import { Stack } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <PlaceholderScreen
        title="Screen not found"
        description="This route does not exist."
        links={[{ label: 'Back to events', href: '/' }]}
      />
    </>
  );
}
