import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import pluginImport from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['./queries'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'no-unused-vars': 'warn',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js 내장 모듈 (예: 'path', 'fs')
            'external', // 외부 라이브러리 (예: 'react', 'next', 'lodash')
            'internal', // 프로젝트 내부 절대 경로 (예: '@/components/Button')
            ['parent', 'sibling', 'index'], // 상대 경로
            'object', // (거의 사용되지 않음)
            'type', // 타입 임포트 (TypeScript 사용 시)
          ],
          pathGroups: [
            // 1. React는 기본 external 그룹에 포함되므로, 별도로 position: 'before'를 지정할 필요 없음
            // 2. Next.js 관련 모듈도 external 그룹에 포함되도록 명시적 추가
            {
              pattern: 'next/**', // 'next/router', 'next/image' 등 Next.js 내부 모듈
              group: 'external',
              position: 'before', // external 그룹 내에서 'next' 관련 모듈을 가장 먼저
            },
            {
              pattern: '@/**', // Next.js 기본 alias '@/' 사용 시 (tsconfig.json 참고)
              group: 'internal',
            },
            // 만약 기존에 @src/** alias를 계속 사용한다면 아래도 추가
            {
              pattern: '@src/**',
              group: 'internal',
            },
          ],
          // 'react'는 이제 pathGroups에서 직접 다루지 않으므로 여기서 제거
          pathGroupsExcludedImportTypes: ['type'], // 'type' 임포트는 그룹 순서에서 제외 (가장 마지막에 정렬)
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
