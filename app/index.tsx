import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from '@store/selectors';

export default function RootIndex() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후에 네비게이션 실행
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // 인증 상태에 따라 페이지 이동
    if (isAuthenticated) {
      // 이미 로그인된 경우 메인 페이지로
      router.replace('/(tabs)');
    } else {
      // 로그인되지 않은 경우 로그인 페이지로
      router.replace('/login');
    }
  }, [isAuthenticated, isReady, router]);

  // 로딩 중 표시
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#6c63d9" />
    </View>
  );
}
