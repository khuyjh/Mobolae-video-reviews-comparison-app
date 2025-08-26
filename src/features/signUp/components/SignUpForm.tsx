'use client';

import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import PasswordInput from '@/shared/components/PasswordInput';

const SignUpForm = () => {
  return (
    <form className='mx-auto flex flex-col gap-[30px] md:w-110 md:gap-10 xl:w-160'>
      <Input
        label='이메일'
        id='email'
        type='email'
        autoComplete='email'
        placeholder='이메일을 입력해 주세요'
      />
      <Input
        label='닉네임'
        id='nickname'
        type='text'
        placeholder='닉네임을 입력해 주세요'
        helperText='최대 20자 가능'
      />
      <PasswordInput
        label='비밀번호'
        id='password'
        placeholder='비밀번호를 입력해 주세요'
        helperText='최소 8자 이상'
        autoComplete='new-password'
      />
      <PasswordInput
        label='비밀번호 확인'
        id='passwordCheck'
        placeholder='비밀번호를 한번 더 입력해 주세요'
        autoComplete='new-password'
      />
      <Button className='mt-[126px] max-w-full md:mt-5' type='submit'>
        가입하기
      </Button>
    </form>
  );
};
export default SignUpForm;
