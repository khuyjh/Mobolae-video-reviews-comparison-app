/**
 * 배열을 일정 크기(size)만큼 잘라 2차원 배열로 반환
 *
 * @param array 원본 배열
 * @param size 한 묶음 크기
 * @returns 잘린 배열의 배열
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    rows.push(array.slice(i, i + size));
  }
  return rows;
}
