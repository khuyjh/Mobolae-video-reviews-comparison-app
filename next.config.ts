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
    loader: 'custom',
    loaderFile: './src/shared/lib/wsrvLoader.ts',

    // Tailwind 브레이크포인트에 맞춘 반응형 이미지 크기
    deviceSizes: [360, 768, 1280], // 모바일, 태블릿, PC
    imageSizes: [16, 32, 64, 128, 256], // 아이콘/썸네일 등 소형 이미지

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**', // 경로 패턴, 모든 이미지 허용
      },
    ],
  },
};

export default nextConfig;
