import { Category } from '../types/categoryTypes';

/**
 * 카테고리 목록 데이터
 * 7개의 카테고리를 정의합니다.
 * TODO: 이 데이터를 서버에서 받아오도록 변경 예정 - 매핑 필요
 */
export const CATEGORIES: Category[] = [
  { id: 1, name: '영화', value: 'MOVIE' },
  { id: 2, name: '드라마', value: 'DRAMA' },
  { id: 3, name: '공연/뮤지컬', value: 'STAGE' },
  { id: 4, name: '애니메이션', value: 'ANIMATION' },
  { id: 5, name: '다큐멘터리', value: 'DOCUMENTARY' },
  { id: 6, name: '키즈', value: 'KIDS' },
  { id: 7, name: '예능', value: 'ENTERTAINMENT' },
];

// api url/key
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
