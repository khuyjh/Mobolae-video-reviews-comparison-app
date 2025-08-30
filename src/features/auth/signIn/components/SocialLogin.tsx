'use client';

// import { usePathname } from 'next/navigation';

import KakaoIcon from '../../../../../public/icons/KakaoIcon.svg';

const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';

const SocialLogin = () => {
  // const pathname = usePathname();
  const currentOrigin = window.location.origin;

  const handleClickKakaoLogin = () => {
    if (!process.env.NEXT_PUBLIC_KAKAO_APP_KEY) {
      return;
    }

    const params = {
      client_id: process.env.NEXT_PUBLIC_KAKAO_APP_KEY,
      redirect_uri: `${currentOrigin}/oauth/kakao`,
      response_type: 'code',
      // redirect 로직을 처리할 때 사용 예정
      // state: pathname,
    };
    const queryString = new URLSearchParams(params).toString();
    window.location.href = `${KAKAO_AUTH_URL}?${queryString}`;
  };

  return (
    <div className='mt-15 flex items-center justify-center gap-4'>
      <span className='text-md-regular xl:text-base-regular text-gray-600'>
        SNS로 바로 시작하기
      </span>
      <button
        className='cursor-pointer'
        type='button'
        aria-label='카카오톡 소셜 로그인 버튼'
        onClick={handleClickKakaoLogin}
      >
        <KakaoIcon />
      </button>
    </div>
  );
};

export default SocialLogin;
