'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { kakaoSignInRequest } from '@/features/auth/api/authApi';
import KakaoError from '@/features/auth/components/KakaoError';

const KakaoCallbackPage = () => {
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const kakaoError = searchParams.get('error');

    if (kakaoError) {
      setHasError(true);
      return;
    }

    //회원가입 된 유저인지 확인
    if (code) {
      const kakaoLogin = async () => {
        try {
          const res = await kakaoSignInRequest({
            redirectUri: `${window.location.origin}/oauth/kakao`,
            token: code,
          });
          console.log(res);
        } catch (e) {
          console.log(e);
          if (isAxiosError(e) && e.status === 404) {
            console.log('여기');
            router.replace(`/oauth/signup/kakao?code=${code}`);
          }
          throw e;
        }
      };

      kakaoLogin();
    }
  }, [searchParams, router]);

  if (hasError) return <KakaoError />;

  return <p className='text-white'>카카오 로그인 처리중...</p>;
};

export default KakaoCallbackPage;
