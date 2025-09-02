'use client';

import { useSearchParams } from 'next/navigation';

import KakaoError from '@/features/auth/components/KakaoError';
import KakaoSignUpForm from '@/features/auth/oauth/components/KakaoSignUpForm';

const KakaoSignUpPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  //로그인 플로우를 통해 접근하지 않고 직접 url입력 접근 등의 경우 차단
  if (!code) return <KakaoError />;

  return (
    <section>
      <KakaoSignUpForm kakaoCode={code} />
    </section>
  );
};

export default KakaoSignUpPage;
