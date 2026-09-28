import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/shared/ui';

export default function ScanScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <PlaceholderScreen
      title="Scan ticket"
      description="Camera QR scanner with online validation (SRS 4.8)."
      links={[
        {
          label: 'Simulate scan',
          href: { pathname: '/scan-result', params: { eventId, code: 'demo-ticket' } },
        },
      ]}
    />
  );
}
