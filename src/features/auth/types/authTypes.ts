interface BaseUserType {
  id: number;
  nickname: string;
  description: string;
  image: null | string;
  createdAt: string;
  updatedAt: string;
  teamId: '16-7';
}

export interface SignUpResponse {
  accessToken: string;
  user: BaseUserType & { email: string };
}

export interface SignUpFormValues {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}
