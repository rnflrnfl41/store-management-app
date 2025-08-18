const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 포트 설정
config.server = {
  port: 8282
};

// Alias 설정
config.resolver.alias = {
  '@': path.resolve(__dirname),
  '@app': path.resolve(__dirname, 'app'),
  '@components': path.resolve(__dirname, 'components'),
  '@features': path.resolve(__dirname, 'features'),
  '@shared': path.resolve(__dirname, 'shared'),
  '@store': path.resolve(__dirname, 'store'),
  '@assets': path.resolve(__dirname, 'assets'),
  '@constants': path.resolve(__dirname, 'constants'),
  '@hooks': path.resolve(__dirname, 'hooks'),
  '@utils': path.resolve(__dirname, 'shared/utils'),
  '@types': path.resolve(__dirname, 'shared/types'),
  '@services': path.resolve(__dirname, 'shared/services'),
  '@styles': path.resolve(__dirname, 'shared/styles'),
};

module.exports = config;
