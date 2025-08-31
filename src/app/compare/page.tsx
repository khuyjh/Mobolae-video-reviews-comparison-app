// 비교하기 페이지
'use client';

import { useState } from 'react';

// Update the path below to match the actual location and filename of CompareSelect
import CompareButton from '../../features/compare/components/CompareButton';
import CompareSelect, { CompareOption } from '../../features/compare/components/CompareSelect';

// 목 데이터 (임시) TODO Api 연결로 대체할 것
const MOCK: CompareOption[] = [
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
  const [left, setLeft] = useState<CompareOption | null>(null);
  const [right, setRight] = useState<CompareOption | null>(null);

  const canCompare = !!left && !!right;

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
          onChange={setLeft}
          options={MOCK}
          placeholder='콘텐츠명을 입력해 주세요'
        />

        {/* 콘텐츠 2 */}
        <CompareSelect
          label='콘텐츠 2'
          className={COMPARE_SELECT_BASE_STYLE}
          value={right}
          scheme='right'
          onChange={setRight}
          options={MOCK}
          placeholder='콘텐츠명을 입력해 주세요'
        />

        {/* 비교 버튼: 모바일에선 3번째 아이템으로 아래, md 이상에선 3번째 컬럼 오른쪽 정렬 */}
        <CompareButton
          disabled={!canCompare}
          // 테스트용 console.log TODO 비교 테이블 제작시 대체할 것
          onClick={() => console.log('COMPARE', left, right)}
          // 레이아웃 위치는 부모 그리드 규칙에 맞춰 여기서 제어
          className='justify-self-start md:justify-self-end'
        />
      </div>
    </div>
  );
};

export default ComparePage;
