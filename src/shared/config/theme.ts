import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#101828', // gray-900
    background: '#ffffff',
    backgroundElement: '#f3f4f6', // gray-100
    backgroundSelected: '#e5e7eb', // gray-200
    textSecondary: '#4a5565', // gray-600
    border: '#d1d5dc', // gray-300
    primary: '#4f39f6', // indigo-600
    onPrimary: '#ffffff',
    danger: '#c10007', // red-700
    success: '#008236', // green-700
    warning: '#bb4d00', // amber-700
  },
  dark: {
    text: '#f9fafb', // gray-50
    background: '#030712', // gray-950
    backgroundElement: '#101828', // gray-900
    backgroundSelected: '#1e2939', // gray-800
    textSecondary: '#99a1af', // gray-400
    border: '#364153', // gray-700
    primary: '#615fff', // indigo-500
    onPrimary: '#ffffff',
    danger: '#ff6467', // red-400
    success: '#05df72', // green-400
    warning: '#ffb900', // amber-400
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
