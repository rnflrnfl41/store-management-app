import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import * as Keychain from 'react-native-keychain';

interface JWTPayload {
  exp: number;  // 만료시간 (Unix timestamp)
  iat: number;  // 발급시간
  // 기타 클레임들...
}

class TokenManager {
  private useKeychain: boolean = true;
  private encryptionKey: string;

  constructor() {
    // 환경변수에서 암호화 키 가져오기
    this.encryptionKey = this.getEncryptionKey();
    
    // Keychain 사용 가능 여부 확인
    this.checkKeychainAvailability();
  }

  // 암호화 키 가져오기 (환경변수 우선, 없으면 기본 키 사용)
  private getEncryptionKey(): string {
    return process.env.EXPO_PUBLIC_TOKEN_SECRET_KEY || '8d990b708713f0ea2ee994ca8d22a5be9a6056e58535c8263af106692f82d5ff';
  }

  // 간단한 암호화 (Expo 환경 최적화)
  private async encryptToken(token: string): Promise<string> {
    try {
      // 간단한 문자열 암호화 (Expo 환경에서 안정적)
      const key = this.encryptionKey.substring(0, 16); // 16자 키 사용
      let encrypted = '';
      
      for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
      }
      
      // Base64로 인코딩하여 저장
      return btoa(encrypted);
    } catch (error) {
      console.log('토큰 암호화 실패, 원본 저장:', error);
      return token; // 암호화 실패 시 원본 반환
    }
  }

  // 간단한 복호화 (Expo 환경 최적화)
  private async decryptToken(encryptedToken: string): Promise<string> {
    try {
      // Base64 디코딩 후 XOR 복호화
      const key = this.encryptionKey.substring(0, 16); // 16자 키 사용
      const encrypted = atob(encryptedToken);
      
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      
      return decrypted;
    } catch (error) {
      console.log('토큰 복호화 실패, 원본 반환:', error);
      return encryptedToken; // 복호화 실패 시 원본 반환
    }
  }

  private async checkKeychainAvailability() {
    try {
      // 간단한 테스트 저장/삭제로 Keychain 작동 확인
      await Keychain.setGenericPassword('test', 'test', {
        service: 'test',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
      await Keychain.resetGenericPassword({ service: 'test' });
      
      this.useKeychain = true;
      console.log('Keychain 사용 가능');
      return;
      
    } catch (error: any) {
      console.log('Keychain 사용 불가, AsyncStorage로 대체:', error);
      
      // 에러 타입별 상세 로그
      if (error.message?.includes('null')) {
        console.log('→ 네이티브 모듈 연결 실패 (Expo Go 또는 네트워크 문제)');
      } else if (error.message?.includes('Permission') || error.message?.includes('permission')) {
        console.log('→ 권한 거부 또는 설정 문제');
      } else if (error.message?.includes('Device') || error.message?.includes('device')) {
        console.log('→ 기기 잠금 또는 하드웨어 문제');
      } else if (error.message?.includes('not supported') || error.message?.includes('unsupported')) {
        console.log('→ 기기 미지원');
      } else {
        console.log('→ 기타 Keychain 문제:', error.message);
      }
      
      this.useKeychain = false;
    }
  }

  // 액세스 토큰 저장
  async saveAccessToken(token: string): Promise<void> {
    try {
      if (this.useKeychain) {
        try {
          const options: Keychain.SetOptions = {
            service: 'accessToken',
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          };

          await Keychain.setGenericPassword('accessToken', token, options);
          console.log('액세스 토큰 저장 성공 (Keychain)');
          return;
        } catch (keychainError) {
          console.log('Keychain 저장 실패, 암호화된 AsyncStorage로 대체:', keychainError);
          this.useKeychain = false;
        }
      }

      // AsyncStorage로 대체 (암호화하여 저장)
      const encryptedToken = await this.encryptToken(token);
      await AsyncStorage.setItem('accessToken', encryptedToken);
      console.log('액세스 토큰 저장 성공 (암호화된 AsyncStorage)');
    } catch (error) {
      console.error('액세스 토큰 저장 실패:', error);
      throw error;
    }
  }

  // 액세스 토큰 가져오기
  async getAccessToken(): Promise<string | null> {
    try {
      if (this.useKeychain) {
        try {
          const credentials = await Keychain.getGenericPassword({ service: 'accessToken' });
          return credentials ? credentials.password : null;
        } catch (error) {
          console.log('Keychain에서 가져오기 실패, 암호화된 AsyncStorage에서 시도:', error);
          this.useKeychain = false;
        }
      }

      // AsyncStorage에서 가져오기 (복호화)
      const encryptedToken = await AsyncStorage.getItem('accessToken');
      if (!encryptedToken) return null;
      
      const decryptedToken = await this.decryptToken(encryptedToken);
      return decryptedToken;
    } catch (error) {
      console.error('액세스 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 리프레시 토큰 저장
  async saveRefreshToken(token: string): Promise<void> {
    try {
      if (this.useKeychain) {
        try {
          const options: Keychain.SetOptions = {
            service: 'refreshToken',
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          };

          await Keychain.setGenericPassword('refreshToken', token, options);
          console.log('리프레시 토큰 저장 성공 (Keychain)');
          return;
        } catch (keychainError) {
          console.log('Keychain 저장 실패, 암호화된 AsyncStorage로 대체:', keychainError);
          this.useKeychain = false;
        }
      }

      // AsyncStorage로 대체 (암호화하여 저장)
      const encryptedToken = await this.encryptToken(token);
      await AsyncStorage.setItem('refreshToken', encryptedToken);
      console.log('리프레시 토큰 저장 성공 (암호화된 AsyncStorage)');
    } catch (error) {
      console.error('리프레시 토큰 저장 실패:', error);
      throw error;
    }
  }

  // 리프레시 토큰 가져오기
  async getRefreshToken(): Promise<string | null> {
    try {
      if (this.useKeychain) {
        try {
          const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
          return credentials ? credentials.password : null;
        } catch (error) {
          console.log('Keychain에서 가져오기 실패, 암호화된 AsyncStorage에서 시도:', error);
          this.useKeychain = false;
        }
      }

      // AsyncStorage에서 가져오기 (복호화)
      const encryptedToken = await AsyncStorage.getItem('refreshToken');
      if (!encryptedToken) return null;
      
      const decryptedToken = await this.decryptToken(encryptedToken);
      return decryptedToken;
    } catch (error) {
      console.error('리프레시 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 모든 토큰 삭제
  async clearTokens(): Promise<void> {
    try {
      if (this.useKeychain) {
        try {
          // 각각의 토큰을 개별적으로 삭제
          await Keychain.resetGenericPassword({ service: 'accessToken' });
          await Keychain.resetGenericPassword({ service: 'refreshToken' });
          console.log('모든 토큰 삭제 완료 (Keychain)');
          return;
        } catch (error) {
          console.log('Keychain 삭제 실패, AsyncStorage에서 시도:', error);
          this.useKeychain = false;
        }
      }

      // AsyncStorage에서 삭제
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      console.log('모든 토큰 삭제 완료 (AsyncStorage)');
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
  }

  // JWT 토큰 만료 여부 확인 (기본: 3일 버퍼)
  isTokenExpired(token: string, bufferTime: number = 3 * 24 * 60 * 60): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return decoded.exp <= (currentTime + bufferTime);
    } catch (error) {
      console.error('JWT 디코딩 실패:', error);
      return true; // 디코딩 실패 시 만료된 것으로 처리
    }
  }

  // 리프레시 토큰 만료 여부 확인 (3일 버퍼)
  isRefreshTokenExpired(token: string): boolean {
    return this.isTokenExpired(token, 3 * 24 * 60 * 60);
  }

  // 리프레시 토큰 정기 갱신 필요 여부
  async shouldRefreshRefreshToken(): Promise<boolean> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) return false;
    
    return this.isRefreshTokenExpired(refreshToken);
  }

  // 리프레시 토큰만 갱신 (액세스 토큰은 건드리지 않음)
  async refreshRefreshTokenOnly(): Promise<boolean> {
    try {
      const currentRefreshToken = await this.getRefreshToken();
      if (!currentRefreshToken) return false;

      // publicAxiosInstance 사용 (로딩, 에러 처리 등 자동화)
      const { publicAxiosInstance } = await import('./apiClient');
      
      const response = await publicAxiosInstance.post('/auth/user/refresh-token-renewal', {
        refreshToken: currentRefreshToken,
      });

      // 새로운 refreshToken만 저장 (인터셉터에서 이미 response.data.data로 변환됨)
      const { refreshToken: newRefreshToken } = response.data;
      await this.saveRefreshToken(newRefreshToken);
      
      return true;
    } catch (error: any) {
      console.error('리프레시 토큰 갱신 실패:', error);
      return false;
    }
  }

  // accessToken 갱신 (tokenManager에서는 저장만 담당)
  async saveTokensFromResponse(accessToken: string, refreshToken: string): Promise<void> {
    await this.saveAccessToken(accessToken);
    await this.saveRefreshToken(refreshToken);
  }
}

export const tokenManager = new TokenManager();

