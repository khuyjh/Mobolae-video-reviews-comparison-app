import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useSignUpOauth } from '../../../../../openapi/queries';
import { me, SignUpOauthError } from '../../../../../openapi/requests';
import { KakaoSignUpSchema, kakaoSignUpSchema } from '../../schemas/authSchema';
import { setCookie } from '../../utils/cookie';

interface Props {
  kakaoCode: string;
  redirectUrl?: string;
  onError: () => void;
}

const KakaoSignUpForm = ({ kakaoCode, redirectUrl, onError }: Props) => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(kakaoSignUpSchema),
    defaultValues: {
      nickname: '',
    },
  });
  const { mutate } = useSignUpOauth([], {
    onSuccess: async (res: AxiosResponse) => {
      const { accessToken } = res.data;

      if (accessToken) {
        setCookie('accessToken', accessToken);
      }

      const meRes = await me(PATH_OPTION);
      const userData = meRes.data;

      if (!userData) {
        //Authguard에서 restoreAuth로 로그인 상태 복구 유도
        onError();
        return;
      }

      setUser(userData);
      toast.success(`${userData.nickname}님 환영합니다!`);

      if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        router.replace('/');
      }
    },
    onError: (e: SignUpOauthError) => {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data.message;

        if (message.includes('닉네임')) {
          //중복 닉네임
          setError('nickname', { type: 'server', message: message });
          return;
        } else if (message.includes('코드')) {
          //유효하지 않은 인가 코드
          onError();
          throw e;
        }
        // 이외 에러
        toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
        throw e;
      }
    },
  });

  const onSubmit: SubmitHandler<KakaoSignUpSchema> = async (data) => {
    mutate({
      path: { ...PATH_OPTION.path, provider: 'kakao' },
      body: {
        redirectUri: `${window.location.origin}/oauth/signup/kakao`,
        token: kakaoCode,
        ...data,
      },
      throwOnError: true,
    });
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
