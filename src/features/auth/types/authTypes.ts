export interface KakaoLoginData {
  redirectUri: string;
  token: string;
}

export interface KakaoSignUpData extends KakaoLoginData {
  nickname: string;
}
