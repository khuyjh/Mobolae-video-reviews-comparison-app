'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';

import { api } from '@/shared/api/apiClients';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import PasswordInput from '@/shared/components/PasswordInput';
import { TEAM_ID } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

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
    if (!TEAM_ID) return;

    try {
      const res = await api.auth.signIn(TEAM_ID, data);
      const resData = res.data;

      if (!res) return;

      const { accessToken } = resData;

      if (accessToken) {
        setCookie('accessToken', accessToken);
      }

      setUser();
      console.log(resData.user?.nickname, '님 환영합니다'); //토스트 로그인 처리

      if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        router.replace('/');
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data.message;
        const status = e.status;
        //status 400에러 -> 유효성 검사 실패 -> 필드 에러 메시지 처리
        if (status === 400 && message.includes('이메일')) {
          setError('email', { type: 'server', message: message });
        } else if (status === 400 && message.includes('비밀번호')) {
          setError('password', { type: 'server', message: message });
        } else if (status === 400) {
          setError('email', { type: 'server', message: '이메일 또는 비밀번호를 다시 확인하세요.' });
          setError('password', {
            type: 'server',
            message: '이메일 또는 비밀번호를 다시 확인하세요.',
          });
        } else {
          // status 400 이외 에러 -> 네트워크 등 문제 -> 토스트로 처리
          console.log(message, status); //추후에 토스트 출력 '알 수 없는 에러가 발생했습니다. 다시 시도하세요'
        }
      }
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
