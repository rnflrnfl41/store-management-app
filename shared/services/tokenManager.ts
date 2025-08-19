import { jwtDecode } from 'jwt-decode';
import * as Keychain from 'react-native-keychain';

interface JWTPayload {
  exp: number;  // 만료시간 (Unix timestamp)
  iat: number;  // 발급시간
  // 기타 클레임들...
}

class TokenManager {
  // 액세스 토큰 저장
  async saveAccessToken(token: string): Promise<void> {
    try {
      await Keychain.setGenericPassword('accessToken', token, {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('액세스 토큰 저장 실패:', error);
      throw error;
    }
  }

  // 액세스 토큰 가져오기
  async getAccessToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('액세스 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 리프레시 토큰 저장
  async saveRefreshToken(token: string): Promise<void> {
    try {
      await Keychain.setGenericPassword('refreshToken', token, {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('리프레시 토큰 저장 실패:', error);
      throw error;
    }
  }

  // 리프레시 토큰 가져오기
  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('리프레시 토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 모든 토큰 삭제
  async clearTokens(): Promise<void> {
    try {
      await Keychain.resetGenericPassword();
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

  // 토큰 만료까지 남은 시간 (초)
  getTokenExpiryTime(token: string): number {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp - currentTime;
    } catch (error) {
      return 0;
    }
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

