'use client';

import KakaoIcon from '../../../../../public/icons/KakaoIcon.svg';
import moveToKakao from '../../utils/moveToKakao';

interface Props {
  redirectUrl?: string;
}

const SocialLogin = ({ redirectUrl }: Props) => {
  const handleClickKakaoLogin = () => {
    moveToKakao('/oauth/kakao', redirectUrl);
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
