import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo } from '@shared/types';

interface AuthState {
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  userInfo: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그인 성공
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    
    // 로그인 실패
    loginFailure: (state) => {
      state.userInfo = null;
    },
    
    // 로그아웃
    logout: (state) => {
      state.userInfo = null;
    },
    
    // Access Token 업데이트
    updateAccessToken: (state, action: PayloadAction<string>) => {
      if (state.userInfo) {
        state.userInfo.accessToken = action.payload;
      }
    },
    
    // 사용자 정보 부분 업데이트
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
    
    // 사용자 정보 설정 (기존 setUserInfo와 동일)
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateAccessToken, 
  updateUserInfo,
  setUserInfo 
} = authSlice.actions;

export default authSlice.reducer;
