export type Reviewer = {
  userId: number; // 내부 기준 키 (id 혼용 금지)
  name: string;
  profileImageUrl: string;
  followers: number; // 숫자 보장
  review: number; // 숫자 보장
  rating?: number; // 선택
};
