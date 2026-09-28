import { PlaceholderScreen } from '@/shared/ui';

export default function EventsScreen() {
  return (
    <PlaceholderScreen
      title="Assigned events"
      description="Only events this Event Admin is assigned to (SRS 4.8)."
      links={[
        { label: 'Demo event', href: '/events/demo' },
        { label: 'Profile', href: '/profile' },
      ]}
    />
  );
}
