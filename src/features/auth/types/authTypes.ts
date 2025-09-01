import { BaseUser } from '@/shared/types/userTypes';

export interface AuthResponse {
  accessToken: string;
  user: BaseUser & { email: string };
}
