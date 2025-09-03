'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

import KakaoError from '@/features/auth/components/KakaoError';
import { setCookie } from '@/features/auth/utils/cookie';
import moveToKakao from '@/features/auth/utils/moveToKakao';
import { api } from '@/shared/api/apiClients';
import LoadingImage from '@/shared/components/LoadingImage';
import { TEAM_ID } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

const KakaoCallbackPage = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const redirectUrl = searchParams.get('state');
    const kakaoError = searchParams.get('error');

    if (kakaoError) {
      setHasError(true);
      return;
    }

    if (!code) {
      setHasError(true);
    } else {
      const kakaoLogin = async () => {
        if (!TEAM_ID) return;

        try {
          const res = await api.auth.signInOauth(TEAM_ID, 'kakao', {
            redirectUri: `${window.location.origin}/oauth/kakao`,
            token: code,
          });
          const resData = res.data;

          if (!res) return;

          const { accessToken } = resData;

          if (accessToken) {
            setCookie('accessToken', accessToken);
          }

          setUser();
          console.log(resData.user?.nickname, '님 환영합니다'); //토스트 로그인 처리

          if (redirectUrl) {
            router.replace(redirectUrl);
          } else {
            router.replace('/');
          }
        } catch (e) {
          if (isAxiosError(e) && e.status === 403) {
            //회원가입 된 유저인지 확인, 아니라면 회원가입으로 이동
            if (redirectUrl) {
              moveToKakao('/oauth/signup/kakao', redirectUrl);
            } else {
              moveToKakao('/oauth/signup/kakao');
            }
          } else if (isAxiosError(e) && e.status === 400)
            //잘못된 인가 코드
            setHasError(true);
          throw e;
        }
      };

      kakaoLogin();
    }
  }, []);

  if (hasError) return <KakaoError />;

  return (
    <div className='flex h-dvh items-center justify-center'>
      <LoadingImage loadingText='간편 로그인 처리중...' />
    </div>
  );
};

export default KakaoCallbackPage;
