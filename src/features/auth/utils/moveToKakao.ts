import { KAKAO_AUTH_URL } from '@/shared/constants/constants';
/*
 카카오 로그인 화면으로 이동해 인가 코드를 받아옴
 redirectUri: 카카오 로그인에서 돌아오는 콜백 페이지
 redirectUrl: 권한 없는 사람이 로그인 페이지로 리다이렉트 되기 전 페이지
 */
const moveToKakao = (redirectUri: string, redirectUrl = '') => {
  const currentOrigin = window.location.origin;

  if (!process.env.NEXT_PUBLIC_KAKAO_APP_KEY) {
    console.log('App Key missing');
    return;
  }

  const params = {
    client_id: process.env.NEXT_PUBLIC_KAKAO_APP_KEY,
    redirect_uri: `${currentOrigin}${redirectUri}`,
    response_type: 'code',
    state: redirectUrl,
  };
  const queryString = new URLSearchParams(params).toString();
  window.location.href = `${KAKAO_AUTH_URL}?${queryString}`;
};

export default moveToKakao;
