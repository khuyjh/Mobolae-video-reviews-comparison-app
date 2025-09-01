import { BaseUser } from '@/shared/types/userTypes';

export interface AuthResponse {
  accessToken: string;
  user: BaseUser & { email: string };
}

export interface KakaoLoginData {
  redirectUri: string;
  token: string;
}

export interface KakaoSignUpData extends KakaoLoginData {
  nickname: string;
}
