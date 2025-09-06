'use client';

import { useSearchParams } from 'next/navigation';

import { useState } from 'react';

import KakaoError from '@/features/auth/components/KakaoError';
import KakaoSignUpForm from '@/features/auth/oauth/components/KakaoSignUpForm';

const KakaoSignUpPage = () => {
  const [hasError, setHasError] = useState(false);
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const redirectUrl = searchParams.get('state');
  const kakaoError = searchParams.get('error');

  //에러 발생 또는 로그인 플로우를 통해 접근하지 않고 직접 url입력 접근 등의 경우 차단
  if (!code || kakaoError || hasError) return <KakaoError />;

  return (
    <section>
      <KakaoSignUpForm
        kakaoCode={code}
        redirectUrl={redirectUrl ? redirectUrl : ''}
        onError={() => {
          setHasError(true);
        }}
      />
    </section>
  );
};

export default KakaoSignUpPage;
