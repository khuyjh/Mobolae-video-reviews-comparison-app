export const formatNumber = (value: string | number) => {
  return typeof value === 'number' ? value.toLocaleString('ko-KR') : value;
};
