// 비교하기 페이지
'use client';

import { useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';

import { PATH_OPTION } from '@/shared/constants/constants';
import { useCompareStore } from '@/shared/stores/useCompareStore';

import { useListProduct } from '../../../openapi/queries';
import CompareButton from '../../features/compare/components/CompareButton';
import CompareResult from '../../features/compare/components/CompareResult';
import CompareSelect from '../../features/compare/components/CompareSelect';

import type { ListProductDefaultResponse } from '../../../openapi/queries/common';
import type { CompareCandidate } from '@/features/compare/types/compareTypes';

// 콘텐츠 리스트 아이템 최소 타입
type ContentList = { id: number; name: string };

// 타입 가드: any 사용 금지용
const toContentList = (v: unknown): v is ContentList => {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as { id?: unknown; name?: unknown };
  return typeof o.id === 'number' && typeof o.name === 'string';
};

// 응답 → CompareCandidate[] 로 변환
function toCandidates(resp: ListProductDefaultResponse | undefined): CompareCandidate[] {
  if (!resp) return [];
  // 스키마가 배열형/객체형 모두 가능성을 고려
  const listUnknown: unknown = Array.isArray(resp) ? resp : (resp as { list?: unknown }).list;
  if (!Array.isArray(listUnknown)) return [];
  const listis = listUnknown.filter(toContentList); // 타입가드로 좁히기
  return listis.map((p) => ({ id: p.id, name: p.name }));
}

// 스타일 상수화
const COMPARE_BASE_STYLE =
  'grid grid-cols-1 items-end gap-y-[30px] md:gap-[24px] md:h-[55px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:h-[70px]';
const COMPARE_SELECT_BASE_STYLE = 'w-full max-w-none min-w-0 md:max-w-[360px] xl:max-w-[400px]';
const PLACEHOLDER_TEXT = '콘텐츠명을 입력해 주세요';
const TOAST_INFO_MESSAGE = '동일한 콘텐츠는 선택할 수 없습니다.';

const ComparePage = () => {
  const a = useCompareStore((s) => s.a);
  const b = useCompareStore((s) => s.b);
  const trySetA = useCompareStore((s) => s.trySetA);
  const trySetB = useCompareStore((s) => s.trySetB);

  /** ------------------------------------------------------
   * 1) 서버에서 상품 리스트를 1페이지 가져옵니다.
   *    - 우선은 "전체 1페이지" 정도만 받아서 로컬 필터(CompareSelect)로 검색
   *    - 데이터가 많아지면, 다음 단계에서 "서버 검색"으로 확장하면 됩니다.
   * ----------------------------------------------------- */
  const { data, isLoading, isError, error } = useListProduct({ ...PATH_OPTION, query: {} }, [], {
    staleTime: 60_000,
  });

  const serverOptions: CompareCandidate[] = useMemo(() => {
    if (isError || !data) return [];
    return toCandidates(data);
  }, [data, isError]);

  useEffect(() => {
    console.log('[DEBUG] BASE_URL', process.env.NEXT_PUBLIC_BASE_URL);
    console.log('[DEBUG] TEAM_ID', PATH_OPTION.path.teamId);
  }, []);

  useEffect(() => {
    console.log('[DEBUG] list data raw:', data);
    console.log('[DEBUG] isLoading:', isLoading, 'isError:', isError, 'error:', error);
  }, [data, isLoading, isError, error]);

  useEffect(() => {
    console.log('[DEBUG] serverOptions length:', serverOptions.length);
    console.log('[DEBUG] first 5:', serverOptions.slice(0, 5));
  }, [serverOptions]);

  useEffect(() => {
    console.log(
      '[DEBUG] names:',
      serverOptions.map((o) => o.name),
    );
  }, [serverOptions]);

  return (
    <main className='mx-auto max-w-4xl p-[24px]'>
      {/* 비교 입력창 + 버튼 래퍼 - 모바일에선 세로, md 이상에선 가로 */}
      <div className={COMPARE_BASE_STYLE}>
        {/* 콘텐츠 1 비교 입력창 */}
        <CompareSelect
          label='콘텐츠 1'
          className={COMPARE_SELECT_BASE_STYLE}
          value={a}
          scheme='left'
          onChange={() => {}} // fallback용. 실제 업데이트는 onTryChange가 담당
          onTryChange={trySetA} // 핵심: 중복 체크 + 상태 반영
          onError={() => toast.info(TOAST_INFO_MESSAGE)}
          options={serverOptions}
          placeholder={PLACEHOLDER_TEXT}
        />

        {/* 콘텐츠 2 비교 입력창 */}
        <CompareSelect
          label='콘텐츠 2'
          className={COMPARE_SELECT_BASE_STYLE}
          value={b}
          scheme='right'
          onChange={() => {}}
          onTryChange={trySetB}
          onError={() => toast.info(TOAST_INFO_MESSAGE)}
          options={serverOptions}
          placeholder={PLACEHOLDER_TEXT}
        />

        {/* 비교 버튼: 모바일에선 3번째 아이템으로 아래, md 이상에선 3번째 컬럼 오른쪽 정렬 */}
        <CompareButton className='justify-self-start md:justify-self-end' />
      </div>
      {/* 결과 섹션(상태 전환 확인용) */}
      <div className='mt-[100px] md:mt-[140px]'>
        <CompareResult />
      </div>
    </main>
  );
};

export default ComparePage;
