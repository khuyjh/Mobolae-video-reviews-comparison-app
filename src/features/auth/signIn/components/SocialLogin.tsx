import KakaoIcon from '../../../../../public/icons/KakaoIcon.svg';

const SocialLogin = () => {
  return (
    <div className='mt-15 flex items-center justify-center gap-4'>
      <span className='text-md-regular xl:text-base-regular text-gray-600'>
        SNS로 바로 시작하기
      </span>
      <button className='cursor-pointer' type='button' aria-label='카카오톡 소셜 로그인 버튼'>
        <KakaoIcon />
      </button>
    </div>
  );
};

export default SocialLogin;
