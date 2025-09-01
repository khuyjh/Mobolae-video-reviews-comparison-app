// 비교하기 페이지
'use client';

import { useState } from 'react';

import { useCompareStore } from '@/features/compare/model/useCompareStore';
import { CompareCandidate } from '@/features/compare/types/compareTypes';

import CompareButton from '../../features/compare/components/CompareButton';
import CompareResult from '../../features/compare/components/CompareResult';
import CompareSelect from '../../features/compare/components/CompareSelect';

// 목 데이터 (임시) TODO Api 연결로 대체할 것
const MOCK: CompareCandidate[] = [
  { id: 1, name: '해리포터: 마법사의 돌' },
  { id: 2, name: '해리포터: 비밀의 방' },
  { id: 3, name: '해리포터: 아즈카반의 죄수' },
  { id: 4, name: '해리포터: 불사조 기사단' },
  { id: 5, name: '해리포터: 혼혈 왕자' },
  { id: 6, name: '존윅' },
  { id: 7, name: '존윅: 리로드' },
  { id: 8, name: '존윅: 파라벨룸' },
  { id: 9, name: '트루먼 쇼' },
  { id: 10, name: '위대한 쇼맨' },
];

// 스타일 상수화
const COMPARE_BASE_STYLE =
  'grid h-[50px] grid-cols-1 items-end gap-y-[30px] md:gap-[24px] md:h-[55px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:h-[70px]';
const COMPARE_SELECT_BASE_STYLE = 'w-full max-w-[335px] min-w-0 md:max-w-[360px] xl:max-w-[400px]';

const ComparePage = () => {
  // 로컬 UI 상태(Chip/입력 표시용)
  const [left, setLeft] = useState<CompareCandidate | null>(null);
  const [right, setRight] = useState<CompareCandidate | null>(null);

  // 전역 스토어 액션: 버튼/결과가 참조
  const setA = useCompareStore((s) => s.setA);
  const setB = useCompareStore((s) => s.setB);

  return (
    <div className='mx-auto max-w-4xl p-[24px]'>
      {/* 비교 입력창 + 버튼 래퍼 - 모바일에선 세로, md 이상에선 가로 */}
      <div className={COMPARE_BASE_STYLE}>
        {/* 콘텐츠 1 */}
        <CompareSelect
          label='콘텐츠 1'
          className={COMPARE_SELECT_BASE_STYLE}
          value={left}
          scheme='left'
          onChange={(v) => {
            setLeft(v); // 로컬
            setA(v); // 전역(버튼 활성/결과 섹션용)
          }}
          options={MOCK}
          placeholder='콘텐츠명을 입력해 주세요'
        />

        {/* 콘텐츠 2 */}
        <CompareSelect
          label='콘텐츠 2'
          className={COMPARE_SELECT_BASE_STYLE}
          value={right}
          scheme='right'
          onChange={(v) => {
            setRight(v);
            setB(v);
          }}
          options={MOCK}
          placeholder='콘텐츠명을 입력해 주세요'
        />

        {/* 비교 버튼: 모바일에선 3번째 아이템으로 아래, md 이상에선 3번째 컬럼 오른쪽 정렬 */}
        <CompareButton className='justify-self-start md:justify-self-end' />
      </div>
      {/* 결과 섹션(상태 전환 확인용) */}
      <div className='mt-10'>
        <CompareResult />
      </div>

      {/* 디버그용(임시): 전역 스토어에 값이 잘 들어오는지 눈으로 확인 */}
      <DebugCompareStore />
    </div>
  );
};

/** 🔍 임시 디버그 위젯: 전역 스토어 상태가 실제로 바뀌는지 확인 */
function DebugCompareStore() {
  const a = useCompareStore((s) => s.a);
  const b = useCompareStore((s) => s.b);
  return (
    <pre className='border-black-700 bg-black-900/40 mt-6 rounded-lg border p-4 text-xs text-gray-400'>
      store.a = {JSON.stringify(a)}
      {'\n'}
      store.b = {JSON.stringify(b)}
    </pre>
  );
}

export default ComparePage;
