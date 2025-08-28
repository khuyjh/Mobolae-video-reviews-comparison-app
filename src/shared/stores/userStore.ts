import Cookies from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getMe } from '@/features/auth/api/authApi';
import { getCookie } from '@/features/auth/utils/cookie';

import { UserState } from '../types/userTypes';

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      setUser: async () => {
        try {
          const user = await getMe();
          if (user) {
            set({ user, isLoggedIn: true });
          }
        } catch (e) {
          console.log('유저 정보 불러오기 실패');
          throw e;
        }
      },
      //사용자의 직접적인 로그아웃
      clearUser: () => {
        set({ user: null, isLoggedIn: false });
        Cookies.remove('accessToken');
      },
      //사이트 진입시 토큰 여부에 따른 강제 로그아웃
      initializeAuth: () => {
        const accessToken = getCookie('accessToken');
        const { isLoggedIn } = get();
        //로그인은 되어있는데 토큰 없음 -> 로그아웃 하지 않았는데 세션 만료
        if (!accessToken && isLoggedIn) {
          //강제 로그아웃
          set({ user: null, isLoggedIn: false });
        }
      },
      updateUser: (updatedUser) => {
        set((prev) => {
          return { ...prev, user: updatedUser };
        });
      },
    }),
    {
      name: 'auth-storage',
      //기본값 로컬 스토리지
    },
  ),
);
