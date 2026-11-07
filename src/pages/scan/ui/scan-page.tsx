import { router, useLocalSearchParams } from 'expo-router';

import { serializeCheckInResult } from '@/entities/check-in';
import { QrScanner } from '@/widgets/qr-scanner';

export function ScanPage() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <QrScanner
      eventId={eventId}
      onResult={(result) =>
        router.push({ pathname: '/scan-result', params: { eventId, result: serializeCheckInResult(result) } })
      }
    />
  );
}
