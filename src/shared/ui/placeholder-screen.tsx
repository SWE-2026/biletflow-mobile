import { Link, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Spacing } from '@/shared/config';

type PlaceholderScreenProps = {
  title: string;
  /** Which SRS requirement(s) this screen covers. */
  description: string;
  links?: { label: string; href: Href }[];
  children?: ReactNode;
};

/** Temporary scaffold for screens that are not implemented yet. */
export function PlaceholderScreen({ title, description, links, children }: PlaceholderScreenProps) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.container}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText themeColor="textSecondary">{description}</ThemedText>
      {links?.map((link) => (
        <Link key={link.label} href={link.href} asChild>
          <Pressable>
            <ThemedView type="backgroundElement" style={styles.link}>
              <ThemedText type="link">{link.label}</ThemedText>
            </ThemedView>
          </Pressable>
        </Link>
      ))}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  link: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
