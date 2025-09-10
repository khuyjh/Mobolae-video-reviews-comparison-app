import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config: WebpackConfig) {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**', // 경로 패턴, 모든 이미지 허용
      },
      //TODO: example api 연결 후 삭제 (테스트 전용)
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      //TODO: 애도 임시 추가
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      //TODO: 아래 도메인 api 연결 후 삭제 (목데이터 전용)
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**', // 목업 이미지 허용
      },
    ],
  },
};

export default nextConfig;
