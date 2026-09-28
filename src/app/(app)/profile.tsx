import { Button } from 'react-native';

import { PlaceholderScreen } from '@/components/placeholder-screen';
import { useSession } from '@/providers/session-provider';

export default function ProfileScreen() {
  const { signOut } = useSession();

  return (
    <PlaceholderScreen title="Profile" description="Account details and sign out (SRS 4.1).">
      <Button title="Sign out" onPress={signOut} />
    </PlaceholderScreen>
  );
}
