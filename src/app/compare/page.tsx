// 비교하기 페이지
'use client';

import { useCompareStore } from '@/features/compare/model/useCompareStore';
import { MOCK_CANDIDATES } from '@/features/compare/types/compareMockTypes';
import { CompareCandidate } from '@/features/compare/types/compareTypes';

import CompareButton from '../../features/compare/components/CompareButton';
import CompareResult from '../../features/compare/components/CompareResult';
import CompareSelect from '../../features/compare/components/CompareSelect';

// 스타일 상수화
const COMPARE_BASE_STYLE =
  'grid grid-cols-1 items-end gap-y-[30px] md:gap-[24px] md:h-[55px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:h-[70px]';
const COMPARE_SELECT_BASE_STYLE = 'w-full max-w-[335px] min-w-0 md:max-w-[360px] xl:max-w-[400px]';

const ComparePage = () => {
  const a = useCompareStore((s) => s.a);
  const b = useCompareStore((s) => s.b);
  const setA = useCompareStore((s) => s.setA);
  const setB = useCompareStore((s) => s.setB);
  const resetRequested = useCompareStore((s) => s.resetRequest);

  return (
    <main className='mx-auto max-w-4xl p-[24px]'>
      {/* 비교 입력창 + 버튼 래퍼 - 모바일에선 세로, md 이상에선 가로 */}
      <div className={COMPARE_BASE_STYLE}>
        {/* 콘텐츠 1 */}
        <CompareSelect
          label='콘텐츠 1'
          className={COMPARE_SELECT_BASE_STYLE}
          value={a}
          scheme='left'
          onChange={(v) => {
            setA(v);
            resetRequested();
          }}
          options={MOCK_CANDIDATES}
          placeholder='콘텐츠명을 입력해 주세요'
        />

        {/* 콘텐츠 2 */}
        <CompareSelect
          label='콘텐츠 2'
          className={COMPARE_SELECT_BASE_STYLE}
          value={b}
          scheme='right'
          onChange={(v) => {
            setB(v);
            resetRequested();
          }}
          options={MOCK_CANDIDATES}
          placeholder='콘텐츠명을 입력해 주세요'
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
