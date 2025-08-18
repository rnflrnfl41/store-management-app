# Store Management App

스토어 관리를 위한 React Native 앱입니다.

## 🏗️ 프로젝트 구조

```
store-management-app/
├── app/                    # Expo Router 기반 페이지
│   ├── _layout.tsx        # 루트 레이아웃
│   ├── (tabs)/            # 탭 네비게이션
│   └── +not-found.tsx     # 404 페이지
├── components/             # 공통 컴포넌트
├── features/               # 기능별 모듈
│   ├── auth/              # 인증 관련
│   ├── products/          # 상품 관련
│   └── orders/            # 주문 관련
├── shared/                 # 공유 모듈
│   ├── components/        # 공통 UI 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   ├── utils/             # 유틸리티 함수
│   ├── types/             # 타입 정의
│   ├── constants/         # 상수
│   └── services/          # API 서비스
├── store/                  # 상태 관리
├── assets/                 # 이미지, 폰트 등
└── constants/              # 기존 상수 (이전 구조)
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- Expo CLI
- iOS Simulator 또는 Android Emulator

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 특정 플랫폼에서 실행
npm run android
npm run ios
npm run web
```

## 📱 사용된 기술

- **React Native** - 모바일 앱 프레임워크
- **Expo** - React Native 개발 도구
- **TypeScript** - 타입 안전성
- **Expo Router** - 파일 기반 라우팅
- **Metro** - 번들러

## 🔧 설정

### Alias 설정
프로젝트에서 사용할 수 있는 경로 별칭들:

```typescript
import { formatCurrency } from '@utils/index';
import { Product } from '@types/index';
import { API_CONFIG } from '@shared/constants';
```

### 환경 변수
`.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```bash
cp env.example .env
```

## 📁 주요 폴더 설명

- **`app/`**: Expo Router를 사용한 페이지 구조
- **`features/`**: 비즈니스 로직별로 분리된 기능 모듈
- **`shared/`**: 여러 기능에서 공통으로 사용하는 모듈
- **`store/`**: 전역 상태 관리 (Redux/Zustand 등)
- **`components/`**: 재사용 가능한 UI 컴포넌트

## 🎯 개발 가이드라인

1. **컴포넌트**: `@shared/components`에 공통 컴포넌트 배치
2. **타입**: `@shared/types`에 공통 타입 정의
3. **유틸리티**: `@shared/utils`에 공통 함수 배치
4. **상수**: `@shared/constants`에 공통 상수 정의
5. **기능**: `@features`에 비즈니스 로직별로 모듈화

## 📝 스크립트

- `npm start`: 개발 서버 시작
- `npm run android`: Android 에뮬레이터에서 실행
- `npm run ios`: iOS 시뮬레이터에서 실행
- `npm run web`: 웹 브라우저에서 실행
- `npm run lint`: 코드 린팅
- `npm run reset-project`: 프로젝트 초기화

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인
2. 기능 브랜치 생성
3. 변경사항 커밋
4. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
