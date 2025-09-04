'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import PasswordInput from '@/shared/components/PasswordInput';
import { useUserStore } from '@/shared/stores/userStore';

import { getMe, signInRequest } from '../../api/authApi';
import { SignInSchema, signInSchema } from '../../schemas/authSchema';
import { setCookie } from '../../utils/cookie';

interface Props {
  redirectUrl?: string;
}

const SignInForm = ({ redirectUrl }: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    try {
      const res = await signInRequest(data);
      const { accessToken } = res;

      if (accessToken) {
        setCookie('accessToken', accessToken);
      }

      //받은 토큰으로 유저 정보 불러오기
      try {
        const user = await getMe();

        if (user) {
          setUser(user);
        }

        toast.success(`${res.user?.nickname}님 환영합니다!`);

        if (redirectUrl) {
          router.replace(redirectUrl);
        } else {
          router.replace('/');
        }
      } catch (e) {
        throw e;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data.message;
        const status = e.status;
        //status 400에러 -> 유효성 검사 실패 -> 필드 에러 메시지 처리
        if (status === 400 && message.includes('이메일')) {
          //존재하지 않는 이메일
          setError('email', { type: 'server', message: message });
          return;
        } else if (status === 400 && message.includes('비밀번호')) {
          //비밀번호 불일치
          setError('password', { type: 'server', message: message });
          return;
        } else if (status === 400) {
          //형식 불일치
          setError('email', { type: 'server', message: '이메일 또는 비밀번호를 다시 확인하세요.' });
          setError('password', {
            type: 'server',
            message: '이메일 또는 비밀번호를 다시 확인하세요.',
          });
          return;
        }
        // status 400 이외 에러
        toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
        throw e;
      }
      // axios외 에러
      toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
      throw e;
    }
  };

  return (
    <form
      className='mx-auto flex flex-col gap-[30px] md:w-110 md:gap-10 xl:w-160'
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Input
        label='이메일'
        id='email'
        type='email'
        autoComplete='email'
        placeholder='이메일을 입력해 주세요'
        error={errors.email}
        {...register('email')}
      />
      <PasswordInput
        label='비밀번호'
        id='password'
        placeholder='비밀번호를 입력해 주세요'
        autoComplete='current-password'
        error={errors.password}
        {...register('password')}
      />
      <Button className='mt-[30px] max-w-full md:mt-5' type='submit' disabled={isSubmitting}>
        {isSubmitting ? '요청 대기중...' : '로그인'}
      </Button>
    </form>
  );
};
export default SignInForm;
