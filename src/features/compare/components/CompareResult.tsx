// 비교 결과 테이블, 비교 결과 문구 담는 컨테이너 컴포넌트
// 역할: CompareResultTable, CompareResultSummary 포함,
// api 가져오기
'use client';

import { keepPreviousData } from '@tanstack/react-query';
import { useEffect } from 'react';

import { PATH_OPTION } from '@/shared/constants/constants';
import { useCompareStore } from '@/shared/stores/useCompareStore'; // a,b 전역 상태 관리용
import {
  selectA,
  selectB,
  selectRequested,
  selectRequestTick,
  selectCanCompare,
} from '@/shared/stores/useCompareStoreSelectors'; // 표준 셀렉터 적용

import CompareResultSummary from './CompareResultSummary';
import CompareResultTable from './CompareResultTable';
import { useRetrieveProduct } from '../../../../openapi/queries'; // 코드젠으로 생성된 API 훅
import compareCalc from '../lib/compareCalc';
import {
  METRIC_CONFIG,
  MetricKey,
  CompareCandidate,
  CompareRow,
  decideWinner,
} from '../types/compareTypes';

import type { RetrieveProductDefaultResponse } from '../../../../openapi/queries/common'; //코드젠이 생성한 "원본 응답" 타입

/** ===============================================
 * 타입 정리
 * =============================================== */

// 원본 응답에서 undefined 제거 (일부 코드젠 템플릿이 data를 T | undefined로 추론)
type ProductRes = NonNullable<RetrieveProductDefaultResponse>;

type Selected = { id: number; name: string } & Record<MetricKey, number>;

//얘비 유틸
function toSelected(raw: ProductRes): Selected {
  return {
    id: raw.id,
    name: raw.name,
    rating: raw.rating ?? raw.categoryMetric?.rating ?? 0,
    reviewCount: raw.reviewCount ?? raw.categoryMetric?.reviewCount ?? 0,
    favoriteCount: raw.favoriteCount ?? raw.categoryMetric?.favoriteCount ?? 0,
  };
}

/** --------------------------------------------
 * 공용 플레이스홀더
 * - variant별로 다른 문구
 * ------------------------------------------- */
function ResultPlaceholder({ variant }: { variant: 'idle' | 'ready' | 'error' }) {
  const map = {
    idle: { text: '콘텐츠를 입력 후 엔터 혹은 검색결과를 클릭해 주세요.' },
    ready: {
      text: '비교하기 버튼을 눌러 결과를 확인해 주세요!',
    },
    error: {
      text: '데이터를 불러오지 못했어요!',
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
 * - CompareResultSummary, CompareResultTable은 데이터 준비 완료시에만 렌더
 * ------------------------------------------- */
const CompareResult = () => {
  // 1) a/b 선택값 + "비교하기" 버튼 눌림 여부
  const a = useCompareStore(selectA) as CompareCandidate | null;
  const b = useCompareStore(selectB) as CompareCandidate | null;
  const requested = useCompareStore(selectRequested);
  const canCompare = useCompareStore(selectCanCompare);
  const requestTick = useCompareStore(selectRequestTick);
  const setInFlight = useCompareStore((state) => state.setInFlight);
  // id 확정값 (없으면 null)
  const productIdA = a ? a.id : null;
  const productIdB = b ? b.id : null;

  // 각 쿼리의 실행 조건
  const enabledA = requested && canCompare && productIdA !== null;
  const enabledB = requested && canCompare && productIdB !== null;

  // 코드젠 활용 API 불러오기
  const pA = useRetrieveProduct<ProductRes>(
    {
      path: { ...PATH_OPTION.path, productId: productIdA ?? 0 },
    },
    [productIdA, requestTick],
    {
      enabled: enabledA,
      staleTime: 0,
      placeholderData: keepPreviousData, //TanStack Query v5 여서 keepPreviousData: true가 아니라 placeholderData 사용. 이전 데이터 유지기능
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );

  const pB = useRetrieveProduct<ProductRes>(
    {
      path: { ...PATH_OPTION.path, productId: productIdB ?? 0 },
    },
    [productIdB, requestTick],
    {
      enabled: enabledB,
      staleTime: 0,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );

  // 네트워크 fetching 중인지 스토어에 반영 → 페이지에서 버튼을 잠가 더블클릭 방지
  useEffect(() => {
    const isFetching = Boolean(pA.isFetching || pB.isFetching);
    setInFlight(isFetching);
    return () => setInFlight(false);
  }, [pA.isFetching, pB.isFetching, setInFlight]);

  /** ---------- 상태 분기(UI만 담당) ---------- */
  if (!a || !b) return <ResultPlaceholder variant='idle' />; //  입력 전(두 슬롯 중 하나라도 비었을 때)
  if (!canCompare) return <ResultPlaceholder variant='ready' />;
  if (!requested) return <ResultPlaceholder variant='ready' />;
  if (pA.isPending || pB.isPending)
    return <div className='bg-black-800 mt-8 h-48 animate-pulse rounded-xl' />;
  if (pA.isError || pB.isError || !pA.data || !pB.data)
    return <ResultPlaceholder variant='error' />;

  /** ---------- 성공 시: 행/승패 계산 ---------- */
  // 서버에서 A/B 순서로 들어온다고 가정 (확실하지 않다면 id로 매칭하세요)
  const metricsA = pA.data;
  const metricsB = pB.data;

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
      <CompareResultSummary
        aId={a.id}
        bId={b.id}
        aName={a.name}
        bName={b.name}
        aWins={aWins}
        bWins={bWins}
        ties={ties}
      />
      {/* 상세 테이블 */}
      <CompareResultTable aName={a.name} bName={b.name} rows={rows} />
    </section>
  );
};

export default CompareResult;
