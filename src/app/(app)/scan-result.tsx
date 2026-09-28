import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function ScanResultScreen() {
  const { eventId, code } = useLocalSearchParams<{ eventId: string; code: string }>();

  return (
    <PlaceholderScreen
      title="Scan result"
      description={`Valid / invalid / cancelled / refunded / already used, and rejected Campaign QR codes (SRS 4.8, 4.14). Event: ${eventId}, code: ${code}`}
    />
  );
}
