import SignInForm from '@/features/signIn/components/SignInForm';
import SocialLogin from '@/features/signIn/components/SocialLogin';

const SignInPage = () => {
  return (
    <main className='px-5 pt-27 md:pt-[250px] xl:pt-45'>
      <SignInForm />
      <SocialLogin />
    </main>
  );
};

export default SignInPage;
