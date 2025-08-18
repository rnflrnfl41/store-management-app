import type { RootState } from '@/store/index';
import { globalSpinnerStyles } from '@styles';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';

const GlobalSpinner = () => {
  const loading = useSelector((state: RootState) => state.loading);

  if (!loading) return null;

  return (
    <View style={globalSpinnerStyles.overlay}>
      <View style={globalSpinnerStyles.spinnerContainer}>
        <ActivityIndicator size="large" color="#6c63d9" />
      </View>
    </View>
  );
};

export default GlobalSpinner;
