'use client';

import { useSearchParams } from 'next/navigation';

import SignInForm from '@/features/auth/signIn/components/SignInForm';
import SocialLogin from '@/features/auth/signIn/components/SocialLogin';

const SignInPage = () => {
  const params = useSearchParams();
  const redirectUrl = params.get('redirect_url');

  return (
    <main className='px-5 pt-27 md:pt-[250px] xl:pt-45'>
      <SignInForm redirectUrl={redirectUrl ? redirectUrl : ''} />
      <SocialLogin redirectUrl={redirectUrl ? redirectUrl : ''} />
    </main>
  );
};

export default SignInPage;
