import { useState } from 'react';

import { useSession } from '@/entities/session';
import { Button } from '@/shared/ui';

export function SignOutButton() {
  const { signOut } = useSession();
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant="secondary"
      title="Sign out"
      loading={pending}
      onPress={() => {
        setPending(true);
        signOut();
      }}
    />
  );
}
