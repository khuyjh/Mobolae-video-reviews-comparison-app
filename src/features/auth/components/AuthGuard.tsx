'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/shallow';

import LoadingImage from '@/shared/components/LoadingImage';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { me } from '../../../../openapi/requests';
import { getCookie } from '../utils/cookie';
/*
AUTH_ROUTES: 로그인 되었을 때 접근 방지할 경로
NEED_AUTH_ROUTES: 로그인 되지 않았을 때 접근 방지할 경로
*/
const AUTH_ROUTES = ['/signin', '/signup', '/oauth/kakao', '/oauth/signup/kakao'];
const NEED_AUTH_ROUTES = ['/compare', '/mypage'];

interface Props {
  children: ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const hasRedirectUrl = !!(params.get('redirect_url') || params.get('state'));
  const isAuthPath = AUTH_ROUTES.includes(pathname);
  const isNeedAuthPath = NEED_AUTH_ROUTES.includes(pathname);
  const accessToken = getCookie('accessToken');
  const { isLoggedIn, initializeAuth, setUser } = useUserStore(
    useShallow((state) => ({
      isLoggedIn: state.isLoggedIn,
      initializeAuth: state.initializeAuth,
      setUser: state.setUser,
    })),
  );

  const restoreAuth = useCallback(async () => {
    if (accessToken && !isLoggedIn) {
      try {
        const res = await me(PATH_OPTION);

        if (!res.data) return;

        setUser(res.data);
      } catch (e) {
        toast.error(`사용자 정보를 불러오지 못했습니다.\n새로고침을 시도해주세요.`);
        throw e;
      }
    }
  }, [accessToken, isLoggedIn, setUser]);

  useEffect(() => {
    setIsMounted(true);
    //토큰 여부를 확인해서 유저권한 제어, 마운트시 1회 실행
    initializeAuth();
  }, []);

  useEffect(() => {
    //마운트 이전 로딩화면을 보여줌으로써 하이드레이션 에러를 일으키는 것을 방지
    if (!isMounted) return;

    //토큰은 있는데 유저 정보가 소실된 경우 권한 복구
    restoreAuth();

    if (isLoggedIn && isAuthPath) {
      //정상적인 로그인, 회원가입 프로세스중 리다이렉트 url을 가지고 있을 때에는 홈으로 보내는 동작을 막음
      if (!hasRedirectUrl) {
        router.replace('/');
      }
    }

    if (!isLoggedIn && isNeedAuthPath) {
      router.replace('/');
    }
  }, [isLoggedIn, isAuthPath, isNeedAuthPath, router, isMounted, hasRedirectUrl, restoreAuth]);

  if (!isMounted || (isLoggedIn && isAuthPath) || (!isLoggedIn && isNeedAuthPath)) {
    return (
      <div className='flex h-dvh items-center justify-center'>
        <LoadingImage loadingText='Loading...' />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
