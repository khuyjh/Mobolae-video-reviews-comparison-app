'use client';

import { useSearchParams } from 'next/navigation';

import SignUpForm from '@/features/auth/signUp/components/SignUpForm';

const SignUpPage = () => {
  const params = useSearchParams();
  const redirectUrl = params.get('redirect_url');

  return (
    <main className='px-5 pt-[30px] pb-10 md:pt-45 xl:pt-23'>
      <SignUpForm redirectUrl={redirectUrl ? redirectUrl : ''} />
    </main>
  );
};

export default SignUpPage;
