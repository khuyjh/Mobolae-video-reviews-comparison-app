import z from 'zod';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*]+$/;
//모든 항목이 필수이기 때문에 중복되는 규칙인 필수값 규칙을 기본으로 세팅, 제출될 때 trim처리
const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1, { message: '필수 입력 항목입니다.' });

//SignUp
export const signUpSchema = z
  .object({
    email: requiredString.regex(EMAIL_REGEX, { message: '이메일 형식으로 작성해 주세요.' }),
    nickname: requiredString.max(20, { message: '닉네임은 최대 20자까지 가능합니다.' }),
    password: requiredString
      .regex(PASSWORD_REGEX, { message: '비밀번호는 숫자, 영문, 특수문자로만 가능합니다.' })
      .min(8, { message: '비밀번호는 최소 8자 이상입니다.' }),
    passwordConfirmation: requiredString,
  })
  // 전체 객체를 대상으로 추가 유효성 검사, path -> 에러를 표시할 필드
  .refine((data) => data.password === data.passwordConfirmation, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirmation'],
  });

//z.infer -> 스키마로부터 typescript 타입 자동 추론
export type SignUpSchema = z.infer<typeof signUpSchema>;

//SignIn
export const signInSchema = z.object({
  email: trimmedString,
  password: trimmedString,
});

export type SignInSchema = z.infer<typeof signInSchema>;

//간편 회원가입
export const kakaoSignUpSchema = z.object({
  nickname: requiredString.max(20, { message: '닉네임은 최대 20자까지 가능합니다.' }),
});

export type KakaoSignUpSchema = z.infer<typeof kakaoSignUpSchema>;
