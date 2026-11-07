import { TextField } from '@/shared/ui';

import { MAX_QUERY_LENGTH } from '../model/use-attendee-search';

type AttendeeSearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function AttendeeSearchField({ value, onChangeText }: AttendeeSearchFieldProps) {
  return (
    <TextField
      label="Search attendees"
      placeholder="Name, email or ticket ID"
      value={value}
      onChangeText={onChangeText}
      maxLength={MAX_QUERY_LENGTH}
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
      returnKeyType="search"
      inputMode="search"
    />
  );
}
