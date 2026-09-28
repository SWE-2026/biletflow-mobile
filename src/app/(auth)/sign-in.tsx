import { Button } from 'react-native';

import { PlaceholderScreen } from '@/components/placeholder-screen';
import { useSession } from '@/providers/session-provider';

export default function SignInScreen() {
  const { signIn } = useSession();

  return (
    <PlaceholderScreen
      title="Sign in"
      description="Event Admin email + password sign-in (SRS 4.1, 4.8)."
      links={[{ label: 'Forgot password?', href: '/forgot-password' }]}>
      {/* TODO: remove once real auth is wired up */}
      <Button title="Continue (stub sign-in)" onPress={signIn} />
    </PlaceholderScreen>
  );
}
