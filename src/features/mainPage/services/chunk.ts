export function chunkArray<T>(array: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    rows.push(array.slice(i, i + size));
  }
  return rows;
}
