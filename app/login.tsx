import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { publicAxiosInstance } from '@shared/services/apiClient';
import type { LoginRequest } from '@shared/types';
import { loginSuccess } from '@store/authSlice';
import { loginStyles } from '@styles';

type FormState = {
  userId: string;
  password: string;
  rememberMe: boolean;
};

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // 저장된 로그인 ID 불러오기
    loadRememberedLoginId();
  }, []);

  const [formState, setFormState] = useState<FormState>({
    userId: '',
    password: '',
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // 저장된 로그인 ID 불러오기
  const loadRememberedLoginId = async () => {
    try {
      const savedLoginId = await AsyncStorage.getItem('rememberedLoginId');
      if (savedLoginId) {
        setFormState(s => ({ ...s, userId: savedLoginId, rememberMe: true }));
      }
    } catch (error) {
      console.log('저장된 로그인 ID 불러오기 실패:', error);
    }
  };

  // 유효성 검사 함수
  const validateForm = (): boolean => {
    // 아이디 검증
    if (!formState.userId.trim()) {
      Alert.alert('입력 오류', '아이디를 입력해주세요.');
      return false;
    }

    // 비밀번호 검증
    if (!formState.password) {
      Alert.alert('입력 오류', '비밀번호를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const requestData: LoginRequest = {
      loginId: formState.userId.trim(),
      password: formState.password,
      adminLogin: false, // React Native는 일반 사용자용
    };

    try {
      const response = await publicAxiosInstance.post('/auth/login', requestData);

      if (response.data.success) {
        const userData = response.data.data;

        dispatch(loginSuccess(userData));

        // 아이디 기억하기 처리
        if (formState.rememberMe) {
          await AsyncStorage.setItem('rememberedLoginId', formState.userId.trim());
        } else {
          await AsyncStorage.removeItem('rememberedLoginId');
        }

        // 로그인 성공 후 메인 페이지로 이동
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.log('로그인 실패:', error);
      // 에러 메시지는 axiosInstance에서 자동으로 처리됨
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={loginStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={loginStyles.card}>
          {/* 로고 */}
          <View style={loginStyles.logoContainer}>
            <Image
              source={require('@assets/images/haircity-logo.png')}
              style={loginStyles.logo}
              resizeMode="contain"
            />
          </View>

          {/* 로그인 폼 */}
          <View style={loginStyles.form}>
            {/* 아이디 입력 */}
            <View style={loginStyles.formGroup}>
              <Text style={loginStyles.label}>아이디</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="아이디를 입력하세요"
                value={formState.userId}
                onChangeText={(value) => handleChange('userId', value)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* 비밀번호 입력 */}
            <View style={loginStyles.formGroup}>
              <Text style={loginStyles.label}>비밀번호</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="비밀번호를 입력하세요"
                value={formState.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            {/* 아이디 기억하기 */}
            <View style={loginStyles.rememberMeContainer}>
              <TouchableOpacity
                style={loginStyles.checkboxContainer}
                onPress={() => handleChange('rememberMe', !formState.rememberMe)}
                disabled={isLoading}
              >
                <View style={[
                  loginStyles.checkbox,
                  formState.rememberMe && loginStyles.checkboxChecked
                ]}>
                  {formState.rememberMe && (
                    <Text style={loginStyles.checkboxText}>✓</Text>
                  )}
                </View>
                <Text style={loginStyles.rememberMeLabel}>아이디 기억하기</Text>
              </TouchableOpacity>
            </View>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={[
                loginStyles.loginButton,
                isLoading && loginStyles.loginButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={loginStyles.loginButtonText}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
