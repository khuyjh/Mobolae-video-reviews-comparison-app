// 비교 계산 전용 타입(컴포넌트에서 쓰는 타입과 분리)
// - 한 행이 "높을수록 좋은가?"까지 포함해야 승패를 판정할 수 있음
export type CompareCalcInput = {
  id: string; // 표시용(굳이 안 써도 됨)
  label: string; // 테이블 헤더용
  valueA: number; // 상품 A의 값
  valueB: number; // 상품 B의 값
  higherIsBetter: boolean; // true면 큰 값 승리(별점/리뷰/찜 등), false면 작은 값 승리 (확장성 대비)
};

// 최종 집계 결과 타입
export type CompareCalcResult = {
  aWins: number;
  bWins: number;
  ties: number;
};

/**
 * 승/무/패 합계를 계산하는 함수
 */
const compareCalc = (rows: CompareCalcInput[]): CompareCalcResult => {
  let aWins = 0;
  let bWins = 0;
  let ties = 0;

  for (const r of rows) {
    if (r.valueA === r.valueB) {
      ties++;
      continue;
    }
    const aBetter = r.higherIsBetter ? r.valueA > r.valueB : r.valueA < r.valueB;
    if (aBetter) aWins++;
    else bWins++;
  }

  return { aWins, bWins, ties };
};

export default compareCalc;
