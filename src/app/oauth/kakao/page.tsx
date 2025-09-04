'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getMe, kakaoSignInRequest } from '@/features/auth/api/authApi';
import KakaoError from '@/features/auth/components/KakaoError';
import { setCookie } from '@/features/auth/utils/cookie';
import moveToKakao from '@/features/auth/utils/moveToKakao';
import LoadingImage from '@/shared/components/LoadingImage';
import { useUserStore } from '@/shared/stores/userStore';

const KakaoCallbackPage = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const redirectUrl = searchParams.get('state');
  const kakaoError = searchParams.get('error');

  useEffect(() => {
    if (!code) return;

    const kakaoLogin = async () => {
      try {
        const res = await kakaoSignInRequest({
          redirectUri: `${window.location.origin}/oauth/kakao`,
          token: code,
        });
        const { accessToken } = res;

        if (accessToken) {
          setCookie('accessToken', accessToken);
        }

        //받은 토큰으로 유저 정보 불러오기
        try {
          const user = await getMe();

          if (user) {
            setUser(user);
          }

          toast.success(`${res.user?.nickname}님 환영합니다!`);

          if (redirectUrl) {
            router.replace(redirectUrl);
          } else {
            router.replace('/');
          }
        } catch (e) {
          throw e;
        }
      } catch (e) {
        if (axios.isAxiosError(e) && e.status === 403) {
          //회원가입 된 유저인지 확인, 아니라면 회원가입으로 이동
          if (redirectUrl) {
            moveToKakao('/oauth/signup/kakao', redirectUrl);
          } else {
            moveToKakao('/oauth/signup/kakao');
          }
        } else if (axios.isAxiosError(e) && e.status === 400) {
          //유효하지 않은 인가 코드
          setHasError(true);
          throw e;
        }
        // 이외 에러
        toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
        throw e;
      }
    };

    kakaoLogin();
  }, []);

  if (!code || kakaoError || hasError) return <KakaoError />;

  return (
    <div className='flex h-dvh items-center justify-center'>
      <LoadingImage loadingText='간편 로그인 처리중...' />
    </div>
  );
};

export default KakaoCallbackPage;
