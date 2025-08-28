'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import PasswordInput from '@/shared/components/PasswordInput';
import { useUserStore } from '@/shared/stores/userStore';

import { signUpRequest } from '../../api/authApi';
import { signUpSchema, SignUpSchema } from '../../schemas/authSchema';
import { setCookie } from '../../utils/cookie';

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirmation: '',
    },
  });
  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    try {
      const res = await signUpRequest(data);
      const { accessToken } = res;

      if (accessToken) {
        setCookie('accessToken', accessToken);
      }

      setUser();
      console.log(res.user?.nickname, '님 환영합니다'); //토스트 로그인 처리
      router.replace('/');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data.message;
        console.log(message); //추후에 토스트 메시지로 활용, 이메일 중복/닉네임 중복
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
      <Input
        label='닉네임'
        id='nickname'
        type='text'
        placeholder='닉네임을 입력해 주세요'
        helperText='최대 20자 가능'
        error={errors.nickname}
        {...register('nickname')}
      />
      <PasswordInput
        label='비밀번호'
        id='password'
        placeholder='비밀번호를 입력해 주세요'
        helperText='최소 8자 이상'
        autoComplete='new-password'
        error={errors.password}
        {...register('password')}
      />
      <PasswordInput
        label='비밀번호 확인'
        id='passwordConfirmation'
        placeholder='비밀번호를 한번 더 입력해 주세요'
        autoComplete='new-password'
        error={errors.passwordConfirmation}
        {...register('passwordConfirmation')}
      />
      <Button
        className='mt-15 max-w-full md:mt-5'
        type='submit'
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? '요청 대기중...' : '가입하기'}
      </Button>
    </form>
  );
};
export default SignUpForm;
