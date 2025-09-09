/** 한국어 숫자 포맷 (표시용) */
export const formatNumber = (value: string | number) => {
  return typeof value === 'number' ? value.toLocaleString('ko-KR') : value;
};

/** 안전하게 숫자로 변환 (계산/정렬용) */
export const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};
