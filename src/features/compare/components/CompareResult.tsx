// 비교 결과 테이블, 비교 결과 문구 담는 컨테이너 컴포넌트
// 역할: CompareResultTable, CompareResultSummary 포함
// features/compare/components/CompareResult.tsx
'use client';

import { useQuery } from '@tanstack/react-query';

import CompareResultSummary from './CompareResultSummary';
import CompareResultTable from './CompareResultTable';
import compareCalc from '../lib/compareCalc';
import { useCompareStore } from '../model/useCompareStore'; // 전역 상태 관리용
import { fetchCompare } from '../types/compareMockTypes'; // 임시 목데이터용(실제 API로 교체)
import {
  METRIC_CONFIG,
  MetricKey,
  CompareCandidate,
  CompareMetrics,
  CompareRow,
  decideWinner,
} from '../types/compareTypes';

/** --------------------------------------------
 * 공용 플레이스홀더
 * - variant별로 다른 문구
 * ------------------------------------------- */
function ResultPlaceholder({ variant }: { variant: 'idle' | 'ready' | 'error' }) {
  // 필요 시 여기에 프로젝트 실제 경로로 바꾸세요.
  const map = {
    idle: { text: '두 상품을 선택해 비교를 시작하세요.' },
    ready: {
      text: '비교하기 버튼을 눌러 결과를 확인하세요.',
    },
    error: {
      text: '데이터를 불러오지 못했어요.',
    },
  } as const;

  const { text } = map[variant];

  return (
    <div className='bg-black-900 my-16 flex flex-col items-center justify-center rounded-xl border border-none p-10 text-gray-400'>
      <p className='mt-3'>{text}</p>
    </div>
  );
}

/** --------------------------------------------
 * 비교 결과 컨테이너: 상태 분기(입력전/준비/로딩/에러/성공)를 한곳에서 관리
 * - Summary/Table은 "데이터 준비 완료" 시에만 렌더
 * ------------------------------------------- */
const CompareResult = () => {
  // 1) 좌/우 선택값 + "비교하기" 버튼 눌림 여부
  const a = useCompareStore((s) => s.a) as CompareCandidate | null;
  const b = useCompareStore((s) => s.b) as CompareCandidate | null;
  const requested = useCompareStore((s) => s.requested);

  // 2) 두 상품이 모두 선택되고, "비교하기" 버튼을 누른 뒤에만 쿼리 수행
  const enabled = !!a && !!b && requested;

  // 3) 실제 API는 아래 queryFn을 교체하세요.
  const { data, isPending, isError } = useQuery({
    queryKey: ['compare', a?.id, b?.id, requested],
    enabled,
    queryFn: async () => fetchCompare(a!.id, b!.id), // ✅ 통합 목데이터 참조
    staleTime: 60_000,
  });

  /** ---------- 상태 분기(UI만 담당) ---------- */
  if (!a || !b) return <ResultPlaceholder variant='idle' />; //  입력 전(두 슬롯 중 하나라도 비었을 때)
  if (!requested) return <ResultPlaceholder variant='ready' />; //  준비 완료(두 슬롯 선택 완료, 비교 버튼 활성화 및 클릭 전)
  if (isPending) return <div className='bg-black-800 mt-8 h-48 animate-pulse rounded-xl' />; // 로딩
  if (isError || !data) return <ResultPlaceholder variant='error' />; // 에러

  /** ---------- 성공 시: 행/승패 계산 ---------- */
  // 서버에서 A/B 순서로 들어온다고 가정 (확실하지 않다면 id로 매칭하세요)
  const metricsA = data[0];
  const metricsB = data[1];

  // 성공 시: 테이블 행 구성
  const rows: CompareRow[] = (['rating', 'reviewCount', 'favoriteCount'] as MetricKey[]).map(
    (k) => {
      const cfg = METRIC_CONFIG[k];
      const aVal = metricsA[k];
      const bVal = metricsB[k];

      // winner가 'A' | 'B' | 'TIE' 로 정확히 좁혀짐
      const winner = decideWinner(aVal, bVal, cfg.higherIsBetter);
      return { id: k, label: cfg.label, valueA: aVal, valueB: bVal, winner };
    },
  );

  // 요약 문구용 승/무/패 집계 (계산 유틸 사용)
  const { aWins, bWins, ties } = compareCalc(
    rows.map((r) => ({
      // calcCompare는 higherIsBetter 정보를 필요로 하므로 config에서 참조해 전달
      id: r.id,
      label: r.label,
      valueA: r.valueA,
      valueB: r.valueB,
      higherIsBetter: METRIC_CONFIG[r.id].higherIsBetter,
    })),
  );

  return (
    <section aria-labelledby='compare-result'>
      <h2 id='compare-result' className='sr-only'>
        비교 결과
      </h2>

      {/* 요약 문구 */}
      <CompareResultSummary aName={a.name} bName={b.name} aWins={aWins} bWins={bWins} ties={ties} />

      {/* 상세 테이블 */}
      <CompareResultTable aName={a.name} bName={b.name} rows={rows} />
    </section>
  );
};

export default CompareResult;
