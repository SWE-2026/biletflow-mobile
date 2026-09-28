import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/shared/ui';

export default function CheckInsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <PlaceholderScreen
      title="Check-in log"
      description={`Recent check-ins and reversals synced with the platform (SRS 4.8). Event: ${eventId}`}
    />
  );
}
