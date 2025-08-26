import { publicApiClient } from '@/shared/api/apiClients';

import { SignUpFormValues, SignUpResponse } from '../types/authTypes';

export const signUpRequest = async (data: SignUpFormValues): Promise<SignUpResponse> => {
  try {
    const res = await publicApiClient.post('/auth/signUp', data);
    return res.data;
  } catch (e) {
    console.log('회원가입 요청 에러');
    throw e;
  }
};
