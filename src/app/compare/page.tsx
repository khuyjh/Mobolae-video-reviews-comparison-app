// 비교하기 페이지
'use client';

import { toast } from 'react-toastify';

import { useCompareStore } from '@/shared/stores/useCompareStore';

import CompareButton from '../../features/compare/components/CompareButton';
import CompareResult from '../../features/compare/components/CompareResult';
import CompareSelect from '../../features/compare/components/CompareSelect';

// 스타일 상수화
const COMPARE_BASE_STYLE =
  'grid grid-cols-1 items-end gap-y-[30px] md:gap-[24px] md:h-[55px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:h-[70px]';
const COMPARE_SELECT_BASE_STYLE = 'w-full max-w-none min-w-0 md:max-w-[360px] xl:max-w-[400px]';
const PLACEHOLDER_TEXT = '콘텐츠명을 입력해 주세요';

// 사유별 토스트 유틸
const toastByReason = (
  reason: 'duplicate' | 'category-mismatch' | 'missing-category' | 'unknown',
) => {
  switch (reason) {
    case 'duplicate':
      toast.info('동일한 콘텐츠끼리는 비교할 수 없어요.');
      break;
    case 'category-mismatch':
      toast.info('동일한 카테고리끼리만 비교할 수 있어요.');
      break;
    case 'missing-category':
      toast.error('카테고리 정보가 없는 콘텐츠가 있어 비교할 수 없어요.');
      break;
    default:
      toast.info('선택을 완료할 수 없어요. 다시 시도해 주세요.');
  }
};

const ComparePage = () => {
  const a = useCompareStore((s) => s.a);
  const b = useCompareStore((s) => s.b);
  const trySetA = useCompareStore((s) => s.trySetA);
  const trySetB = useCompareStore((s) => s.trySetB);

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
          onError={toastByReason}
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
          onError={toastByReason}
          placeholder={PLACEHOLDER_TEXT}
        />

        {/* 비교 버튼: 모바일에선 3번째 아이템으로 아래, md 이상에선 3번째 컬럼 오른쪽 정렬 */}
        <CompareButton
          className='justify-self-start md:justify-self-end'
          onResult={(ok, reason) => {
            if (!ok && reason) toast.info(reason);
          }}
        />
      </div>
      {/* 결과 섹션(상태 전환 확인용) */}
      <div className='mt-[100px] md:mt-[140px]'>
        <CompareResult />
      </div>
    </main>
  );
};

export default ComparePage;
