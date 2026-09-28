import { useEffect, useState } from 'react';

/** Seconds-remaining countdown; `restart()` starts it again from `seconds`. */
export function useCountdown(seconds: number) {
  const [endsAt, setEndsAt] = useState(() => Date.now() + seconds * 1000);
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return { remaining, restart: () => setEndsAt(Date.now() + seconds * 1000) };
}
