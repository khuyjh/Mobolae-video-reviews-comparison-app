'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useSignUp } from '../../../../../openapi/queries';
import { me, SignUpError } from '../../../../../openapi/requests';
import { signUpSchema, SignUpSchema } from '../../schemas/authSchema';
import { setCookie } from '../../utils/cookie';

interface Props {
  redirectUrl?: string;
}

const SignUpForm = ({ redirectUrl }: Props) => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirmation: '',
    },
  });
  const { mutate } = useSignUp([], {
    onSuccess: async (res: AxiosResponse) => {
      const { accessToken } = res.data;

      if (accessToken) {
        setCookie('accessToken', accessToken);
      }

      const meRes = await me(PATH_OPTION);
      const userData = meRes.data;

      if (!userData) {
        throw new Error();
      }

      setUser(userData);
      toast.success(`${userData.nickname}님 환영합니다!`);

      if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        router.replace('/');
      }
    },
    onError: (e: SignUpError) => {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data.message;
        const status = e.status;

        if (status === 400 && message.includes('이메일')) {
          //중복 이메일
          setError('email', { type: 'server', message: message });
          return;
        } else if (status === 400 && message.includes('닉네임')) {
          //중복 닉네임
          setError('nickname', { type: 'server', message: message });
          return;
        }
        // status 400 이외 에러
        toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
        throw e;
      }
      // axios외 에러
      toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
      throw e;
    },
  });

  const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
    mutate({
      ...PATH_OPTION,
      body: data,
      throwOnError: true,
    });
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
      <Input
        label='비밀번호'
        id='password'
        type='password'
        hasButton={true}
        placeholder='비밀번호를 입력해 주세요'
        helperText='최소 8자 이상'
        autoComplete='new-password'
        error={errors.password}
        {...register('password')}
      />
      <Input
        label='비밀번호 확인'
        id='passwordConfirmation'
        type='password'
        hasButton={true}
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
