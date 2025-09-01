'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ReactNode, useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import LoadingImage from '@/shared/components/LoadingImage';
import { useUserStore } from '@/shared/stores/userStore';
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
  const { isLoggedIn, initializeAuth, restoreAuth } = useUserStore(
    useShallow((state) => ({
      isLoggedIn: state.isLoggedIn,
      initializeAuth: state.initializeAuth,
      restoreAuth: state.restoreAuth,
    })),
  );
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPath = AUTH_ROUTES.includes(pathname);
  const isNeedAuthPath = NEED_AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    setIsMounted(true);
    //토큰 여부를 확인해서 유저권한 제어, 마운트시 1회 실행
    initializeAuth();
    restoreAuth();
  }, []);

  useEffect(() => {
    //마운트 이전 로딩화면을 보여줌으로써 하이드레이션 에러를 일으키는 것을 방지
    if (!isMounted) return;

    if (isLoggedIn && isAuthPath) {
      router.replace('/');
    }

    if (!isLoggedIn && isNeedAuthPath) {
      router.replace('/');
    }
  }, [isLoggedIn, isAuthPath, isNeedAuthPath, router, isMounted]);

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
