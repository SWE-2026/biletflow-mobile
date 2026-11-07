import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from 'expo-router';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';

import type { CheckInResult } from '@/entities/check-in';
import { useScanTicket } from '@/features/scan-ticket';
import { Spacing } from '@/shared/config';
import { useTheme } from '@/shared/lib';
import { Button, StateMessage, ThemedText } from '@/shared/ui';

type QrScannerProps = {
  eventId: string;
  onResult: (result: CheckInResult) => void;
};

/** Full-screen camera that validates ticket QR codes online and checks them in. */
export function QrScanner({ eventId, onResult }: QrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  // Unmount the camera while another screen is on top: it stops scanning and frees the camera on
  // both platforms (CameraView's `active` prop is iOS-only).
  const focused = useIsFocused();
  const { handleScan, pending, error, clearError } = useScanTicket({ eventId, onResult });

  if (!permission) return <StateMessage loading />;

  if (!permission.granted) {
    return permission.canAskAgain ? (
      <StateMessage
        title="Camera access needed"
        message="Allow camera access to scan ticket QR codes."
        action={{ label: 'Allow camera', onPress: requestPermission }}
      />
    ) : (
      <StateMessage
        title="Camera access is off"
        message="Turn on camera access for this app in Settings to scan tickets, or search attendees instead."
        action={{ label: 'Open Settings', onPress: () => Linking.openSettings() }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {focused ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={pending ? undefined : ({ data }) => handleScan(data)}
        />
      ) : null}
      <View style={styles.overlay} pointerEvents="box-none">
        <StatusBar pending={pending} error={error} onDismissError={clearError} />
      </View>
    </View>
  );
}

type StatusBarProps = {
  pending: boolean;
  error: string | null;
  onDismissError: () => void;
};

function StatusBar({ pending, error, onDismissError }: StatusBarProps) {
  const theme = useTheme();

  if (error) {
    return (
      <View style={[styles.status, { backgroundColor: theme.background }]} accessibilityLiveRegion="polite">
        <ThemedText type="smallBold" themeColor="danger">
          Could not check the ticket
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {error}
        </ThemedText>
        <Button variant="secondary" title="Try again" onPress={onDismissError} />
      </View>
    );
  }

  if (!pending) return null;

  return (
    <View
      accessible
      accessibilityLiveRegion="polite"
      style={[styles.status, styles.statusRow, { backgroundColor: theme.background }]}>
      <ActivityIndicator color={theme.text} />
      <ThemedText type="smallBold">Checking ticket…</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: Spacing.four,
  },
  status: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
