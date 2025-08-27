import { publicApiClient } from '@/shared/api/apiClients';

import { SignInSchema, SignUpSchema } from '../schemas/authSchema';
import { AuthResponse } from '../types/authTypes';

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
