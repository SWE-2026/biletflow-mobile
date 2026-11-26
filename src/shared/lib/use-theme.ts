/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/shared/config';
import { useColorScheme } from './use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  // React Native returns null when the system has no preference
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}
