import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing } from '../common';

// 입력 필드 컨테이너 스타일
export const inputContainerStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

// 입력 필드 스타일
export const inputStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: colors.lightGray,
    color: colors.textDisabled,
    opacity: 0.6,
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 18,
  },
});
