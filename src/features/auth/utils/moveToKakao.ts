import { KAKAO_AUTH_URL } from '@/shared/constants/constants';

//카카오 로그인 화면으로 이동해 인가 코드를 받아옴
const moveToKakao = (redirectUri: string, pathname = '') => {
  const currentOrigin = window.location.origin;

  if (!process.env.NEXT_PUBLIC_KAKAO_APP_KEY) {
    console.log('App Key missing');
    return;
  }

  const params = {
    client_id: process.env.NEXT_PUBLIC_KAKAO_APP_KEY,
    redirect_uri: `${currentOrigin}${redirectUri}`,
    response_type: 'code',
    // redirect 로직을 처리할 때 사용 예정
    state: pathname,
  };
  const queryString = new URLSearchParams(params).toString();
  window.location.href = `${KAKAO_AUTH_URL}?${queryString}`;
};

export default moveToKakao;
