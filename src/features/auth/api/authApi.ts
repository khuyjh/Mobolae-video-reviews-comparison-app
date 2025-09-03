import { api } from '@/shared/api/apiClients';
import { TEAM_ID } from '@/shared/constants/constants';

import { SignInSchema, SignUpSchema } from '../schemas/authSchema';
import { KakaoLoginData, KakaoSignUpData } from '../types/authTypes';

export const signUpRequest = async (data: SignUpSchema) => {
  if (!TEAM_ID) return;
  try {
    const res = await api.auth.signUp(TEAM_ID, data);
    return res.data;
  } catch (e) {
    console.log('회원가입 요청 에러');
    throw e;
  }
};

export const signInRequest = async (data: SignInSchema) => {
  if (!TEAM_ID) return;
  try {
    const res = await api.auth.signIn(TEAM_ID, data);
    return res.data;
  } catch (e) {
    console.log('로그인 요청 에러');
    throw e;
  }
};

export const getMe = async () => {
  if (!TEAM_ID) return;
  try {
    const res = await api.user.me(TEAM_ID);
    return res.data;
  } catch (e) {
    console.log('사용자 정보 요청 에러');
    throw e;
  }
};

export const kakaoSignInRequest = async (data: KakaoLoginData) => {
  if (!TEAM_ID) return;
  try {
    const res = await api.auth.signInOauth(TEAM_ID, 'kakao', data);
    return res.data;
  } catch (e) {
    console.log('카카오 로그인 요청 에러');
    throw e;
  }
};

export const kakaoSignUpRequest = async (data: KakaoSignUpData) => {
  if (!TEAM_ID) return;
  try {
    const res = await api.auth.signUpOauth(TEAM_ID, 'kakao', data);
    return res.data;
  } catch (e) {
    console.log('카카오 간편 회원가입 요청 에러');
    throw e;
  }
};
