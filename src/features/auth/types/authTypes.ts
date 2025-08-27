interface BaseUserType {
  id: number;
  nickname: string;
  description: string;
  image: null | string;
  createdAt: string;
  updatedAt: string;
  teamId: '16-7';
}

export interface AuthResponse {
  accessToken: string;
  user: BaseUserType & { email: string };
}
