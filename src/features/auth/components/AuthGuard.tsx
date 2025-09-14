'use client';

import { usePathname, useRouter } from 'next/navigation';

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
  const [isAuthProcess, setIsAuthProcess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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

    /**
     * 1. 만약 로그인 이후에 비정상적인 접근 시도라면 replace를 통해 페이지를 빠져나감
     * 2. 정상적인 로그인 프로세스라면 최초 실행 때 해당 조건문을 뛰어넘어 setter함수가 실행
     * 3. 정상적인 로그인 페이지라는 flag인 isAuthProcess를 true로 전환하여, 다음 useEffect 실행 때 라우팅이 작동하지 않도록 함
     */
    if (isLoggedIn && isAuthPath) {
      if (!isAuthProcess) {
        router.replace('/');
      }
    }
    setIsAuthProcess(true);

    if (!isLoggedIn && isNeedAuthPath) {
      router.replace('/');
    }
  }, [isLoggedIn, isAuthPath, isNeedAuthPath, router, isAuthProcess, isMounted, restoreAuth]);

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
