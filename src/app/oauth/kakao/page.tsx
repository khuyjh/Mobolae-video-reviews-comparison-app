'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import KakaoError from '@/features/auth/components/KakaoError';
import { setCookie } from '@/features/auth/utils/cookie';
import moveToKakao from '@/features/auth/utils/moveToKakao';
import LoadingImage from '@/shared/components/LoadingImage';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useSignInOauth } from '../../../../openapi/queries';
import { me, SignInOauthError } from '../../../../openapi/requests';

const KakaoCallbackPage = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const redirectUrl = searchParams.get('state');
  const kakaoError = searchParams.get('error');
  const { mutate } = useSignInOauth([], {
    onSuccess: async (res: AxiosResponse) => {
      const { accessToken } = res.data;

      if (accessToken) {
        setCookie('accessToken', accessToken);
      }

      const meRes = await me(PATH_OPTION);
      const userData = meRes.data;

      if (!userData) {
        //Authguard에서 restoreAuth로 로그인 상태 복구 유도
        setHasError(true);
        return;
      }

      setUser(userData);
      toast.success(`${userData.nickname}님 환영합니다!`);

      if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        router.replace('/');
      }
    },
    onError: (e: SignInOauthError) => {
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
    },
  });

  useEffect(() => {
    if (!code) return;

    mutate({
      path: { ...PATH_OPTION.path, provider: 'kakao' },
      body: {
        redirectUri: `${window.location.origin}/oauth/kakao`,
        token: code,
      },
      throwOnError: true,
    });
  }, []);

  if (!code || kakaoError || hasError) return <KakaoError />;

  return (
    <div className='flex h-dvh items-center justify-center'>
      <LoadingImage loadingText='간편 로그인 처리중...' />
    </div>
  );
};

export default KakaoCallbackPage;
