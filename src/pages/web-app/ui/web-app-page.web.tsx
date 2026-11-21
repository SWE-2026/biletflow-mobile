import { Linking } from 'react-native';

import { env } from '@/shared/config';
import { StateMessage } from '@/shared/ui';

export function WebAppPage() {
  return (
    <StateMessage
      title="BiletFlow"
      message="The web app opens in your browser."
      action={{ label: 'Open BiletFlow', onPress: () => Linking.openURL(env.webUrl) }}
    />
  );
}
