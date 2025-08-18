import { StyleSheet } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../common';

// 기본 버튼 스타일
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: colors.gray,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
});

// 버튼 텍스트 스타일
export const buttonTextStyles = StyleSheet.create({
  primary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  outline: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    color: colors.textDisabled,
    fontSize: 16,
    fontWeight: '600',
  },
  small: {
    fontSize: 14,
  },
  large: {
    fontSize: 18,
  },
});
