import axios from 'axios';

// 인증 토큰을 요구하지 않는 api 요청 instance
export const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
