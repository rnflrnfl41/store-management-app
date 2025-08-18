import { StyleSheet } from 'react-native';
import { borderRadius, colors, shadows } from '../common';

// GlobalSpinner 스타일
export const globalSpinnerStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
});
