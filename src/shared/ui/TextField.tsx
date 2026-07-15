import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../theme/tokens';

type FieldState = 'empty' | 'focused' | 'filled' | 'error' | 'disabled';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, editable = true, value, onFocus, onBlur, className, ...props }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const state: FieldState = !editable
    ? 'disabled'
    : error
      ? 'error'
      : focused
        ? 'focused'
        : value
          ? 'filled'
          : 'empty';

  const borderColor =
    state === 'error'
      ? colors.error
      : state === 'focused'
        ? colors.accentBorder
        : colors.borderSubtle;

  return (
    <View className={className}>
      {label ? (
        <AppText variant="caption" className="mb-2 text-content-secondary">
          {label}
        </AppText>
      ) : null}
      <TextInput
        editable={editable}
        value={value}
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className="rounded-md px-4 py-3.5 text-base text-content-primary"
        style={{
          backgroundColor: colors.surfacePrimary,
          borderWidth: 1,
          borderColor,
          color: colors.textPrimary,
          opacity: state === 'disabled' ? 0.5 : 1,
        }}
        {...props}
      />
      {error ? (
        <AppText variant="caption" className="mt-1.5 text-error">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" muted className="mt-1.5">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}