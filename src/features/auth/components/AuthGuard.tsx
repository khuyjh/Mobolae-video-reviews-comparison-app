'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ReactNode, useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { useUserStore } from '@/shared/stores/userStore';

//로그인 되었을 때 접근 방지할 경로
const AUTH_ROUTES = ['/signin', '/signup', '/oauth/signup/kakao'];

//로그인 되지 않았을 때 접근 가능한 경로

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
  // const isMounted = useRef(false);

  const isAuthPath = AUTH_ROUTES.includes(pathname);
  //TODO: 로그인이 필요한 경로 처리

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
  }, [isLoggedIn, isAuthPath, router]);

  console.log(!isMounted || (isLoggedIn && isAuthPath));
  if (!isMounted || (isLoggedIn && isAuthPath)) {
    return <div className='text-white'>로딩중...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
