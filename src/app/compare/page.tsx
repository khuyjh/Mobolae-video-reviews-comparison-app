// 비교하기 페이지
'use client';

import { useMemo } from 'react';
import { toast } from 'react-toastify';

import { toCandidates } from '@/features/compare/utils/contentMapper';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useCompareStore } from '@/shared/stores/useCompareStore';

import { useListProduct } from '../../../openapi/queries';
import CompareButton from '../../features/compare/components/CompareButton';
import CompareResult from '../../features/compare/components/CompareResult';
import CompareSelect from '../../features/compare/components/CompareSelect';

import type { CompareCandidate } from '@/features/compare/types/compareTypes';

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

  const { data, isLoading, isError, error } = useListProduct({ ...PATH_OPTION, query: {} }, [], {
    staleTime: 60_000,
  });

  const serverOptions: CompareCandidate[] = useMemo(() => {
    if (isError || !data) return [];
    return toCandidates(data);
  }, [data, isError]);

  return (
    <main className='mx-auto max-w-4xl p-[24px]'>
      {/* 비교 입력창 + 버튼 래퍼 - 모바일에선 세로, md 이상에선 가로 */}
      <div className={COMPARE_BASE_STYLE}>
        {/* 콘텐츠 1 비교 입력창 */}
        <CompareSelect
          label='콘텐츠 1'
          className={COMPARE_SELECT_BASE_STYLE}
          value={a}
          scheme='a'
          onChange={() => {}} // fallback용. 실제 업데이트는 onTryChange가 담당
          onTryChange={trySetA} // 핵심: 중복 체크 + 상태 반영
          onError={() => toast.info(TOAST_INFO_MESSAGE)}
          placeholder={PLACEHOLDER_TEXT}
        />

        {/* 콘텐츠 2 비교 입력창 */}
        <CompareSelect
          label='콘텐츠 2'
          className={COMPARE_SELECT_BASE_STYLE}
          value={b}
          scheme='b'
          onChange={() => {}}
          onTryChange={trySetB}
          onError={() => toast.info(TOAST_INFO_MESSAGE)}
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
