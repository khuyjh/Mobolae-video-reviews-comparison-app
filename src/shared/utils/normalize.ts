/**
 * 사용자 입력을 비교 가능한 형태로 정규화
 * - NFKC 정규화(유니코드 호환)
 * - 소문자 변환
 * - 모든 공백/제로폭 제거
 * - 구두점/심볼 제거(중점·하이픈 등)
 */
export const normalizeForCompare = (text: string) =>
  (text ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\p{White_Space}\u200B-\u200D\uFEFF]+/gu, '')
    .replace(/[\p{P}\p{S}]+/gu, '');
