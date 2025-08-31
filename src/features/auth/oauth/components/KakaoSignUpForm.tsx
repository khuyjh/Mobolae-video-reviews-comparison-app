import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { useUserStore } from '@/shared/stores/userStore';

import { kakaoSignUpRequest } from '../../api/authApi';
import { KakaoSignUpSchema, kakaoSignUpSchema } from '../../schemas/authSchema';
import { setCookie } from '../../utils/cookie';

interface Props {
  kakaoCode: string;
}

const KakaoSignUpForm = ({ kakaoCode }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(kakaoSignUpSchema),
    defaultValues: {
      nickname: '',
    },
  });
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const onSubmit: SubmitHandler<KakaoSignUpSchema> = async (data) => {
    try {
      const res = await kakaoSignUpRequest({
        redirectUri: `${window.location.origin}/oauth/signup/kakao`,
        token: kakaoCode,
        ...data,
      });
      const { accessToken } = res;

      if (accessToken) {
        setCookie('accessToken', accessToken);
      }

      setUser();
      console.log(res.user?.nickname, '님 환영합니다'); //토스트 로그인 처리
      router.replace('/');
    } catch (e) {
      if (isAxiosError(e)) {
        const message = e.response?.data.message;
        console.log(message); //추후에 토스트 메시지로 활용, 닉네임 중복
      }
    }
  };

  return (
    <form
      className='mx-auto flex flex-col gap-15 px-5 pt-57 md:w-110 md:gap-10 md:pt-94 xl:w-160 xl:pt-79'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label='닉네임'
        id='nickname'
        type='text'
        placeholder='닉네임을 입력해 주세요'
        helperText='최대 20자 가능'
        error={errors.nickname}
        {...register('nickname')}
      />
      <Button className='max-w-none' type='submit' variant='primary' disabled={isSubmitting}>
        {isSubmitting ? '요청 대기중...' : '가입하기'}
      </Button>
    </form>
  );
};

export default KakaoSignUpForm;
