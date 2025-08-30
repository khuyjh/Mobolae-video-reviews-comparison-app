import { privateApiClient, publicApiClient } from '@/shared/api/apiClients';
import { DetailUser } from '@/shared/types/userTypes';

import { SignInSchema, SignUpSchema } from '../schemas/authSchema';
import { AuthResponse, KakaoLoginData, KakaoSignUpData } from '../types/authTypes';

export const signUpRequest = async (data: SignUpSchema): Promise<AuthResponse> => {
  try {
    const res = await publicApiClient.post('/auth/signUp', data);
    return res.data;
  } catch (e) {
    console.log('회원가입 요청 에러');
    throw e;
  }
};

export const signInRequest = async (data: SignInSchema): Promise<AuthResponse> => {
  try {
    const res = await publicApiClient.post('/auth/signin', data);
    return res.data;
  } catch (e) {
    console.log('로그인 요청 에러');
    throw e;
  }
};

export const getMe = async (): Promise<DetailUser> => {
  try {
    const res = await privateApiClient.get('/users/me');
    return res.data;
  } catch (e) {
    console.log('사용자 정보 요청 에러');
    throw e;
  }
};

export const kakaoSignInRequest = async (data: KakaoLoginData): Promise<AuthResponse> => {
  try {
    const res = await publicApiClient.post('/auth/signIn/kakao', data);
    return res.data;
  } catch (e) {
    console.log('카카오 로그인 요청 에러');
    throw e;
  }
};

export const kakaoSignUpRequest = async (data: KakaoSignUpData): Promise<AuthResponse> => {
  try {
    const res = await publicApiClient.post('/auth/signUp/kakao', data);
    return res.data;
  } catch (e) {
    console.log('카카오 가편 회원가입 요청 에러');
    throw e;
  }
};
