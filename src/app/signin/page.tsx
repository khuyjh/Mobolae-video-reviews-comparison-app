import SignInForm from '@/features/auth/signIn/components/SignInForm';
import SocialLogin from '@/features/auth/signIn/components/SocialLogin';

const SignInPage = () => {
  return (
    <main className='px-5 pt-27 md:pt-[250px] xl:pt-45'>
      <SignInForm />
      <SocialLogin />
    </main>
  );
};

export default SignInPage;
