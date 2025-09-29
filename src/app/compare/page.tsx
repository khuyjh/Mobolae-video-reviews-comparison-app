// 비교하기 페이지
'use client';

import { toast } from 'react-toastify';

import CompareCategoryNoticeChip from '@/features/compare/components/CompareCategoryNoticeChip';
import { CATEGORIES } from '@/shared/constants/constants';
import { useCompareStore } from '@/shared/stores/useCompareStore';
import { selectA, selectB, selectInFlight } from '@/shared/stores/useCompareStoreSelectors';

import CompareButton from '../../features/compare/components/CompareButton';
import CompareResult from '../../features/compare/components/CompareResult';
import CompareSelect from '../../features/compare/components/CompareSelect';

// 스타일 상수화
const COMPARE_BASE_STYLE =
  'grid gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:grid-rows-[auto_auto] md:gap-x-4 md:gap-y-2';
const COMPARE_SELECT_BASE_STYLE = 'w-full max-w-none min-w-0 md:max-w-[360px] xl:max-w-[400px]';
const COMPARE_BUTTON_STYLE = 'md:row-start-1 md:col-start-3 md:self-end md:justify-self-end';
const PLACEHOLDER_TEXT = '콘텐츠명을 입력해 주세요';

// 사유별 토스트 유틸
const toastByReason = (
  reason: 'duplicate' | 'category-mismatch' | 'missing-category' | 'unknown',
) => {
  switch (reason) {
    case 'duplicate':
      toast.info('같은 콘텐츠끼리는 비교할 수 없어요.');
      break;
    case 'category-mismatch':
      toast.info('같은 카테고리끼리만 비교할 수 있어요.');
      break;
    case 'missing-category':
      toast.error('카테고리가 없는 콘텐츠가 있어 비교할 수 없어요.');
      break;
    default:
      toast.error('선택을 완료할 수 없어요. 다시 시도해 주세요.');
  }
};

const ComparePage = () => {
  const a = useCompareStore(selectA);
  const b = useCompareStore(selectB);
  const trySetA = useCompareStore((s) => s.trySetA);
  const trySetB = useCompareStore((s) => s.trySetB);
  const inFlight = useCompareStore(selectInFlight);

  return (
    <main className='mx-auto max-w-4xl p-[24px]'>
      <div className={COMPARE_BASE_STYLE}>
        <div className='md:col-start-1 md:row-start-1'>
          <CompareSelect
            label='콘텐츠 1'
            className={COMPARE_SELECT_BASE_STYLE}
            value={a}
            scheme='a'
            onChange={() => {}}
            onTryChange={trySetA}
            onError={toastByReason}
            placeholder={PLACEHOLDER_TEXT}
          />
        </div>

        <div className='md:col-start-1 md:row-start-2'>
          <CompareCategoryNoticeChip
            side='A'
            categories={CATEGORIES}
            hideWhenRequested
            className='min-h-[22px]'
          />
        </div>

        <div className='md:col-start-2 md:row-start-1'>
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
        </div>

        <div className='md:col-start-2 md:row-start-2'>
          <CompareCategoryNoticeChip
            side='B'
            categories={CATEGORIES}
            hideWhenRequested
            className='min-h-[22px]'
          />
        </div>

        <CompareButton
          className={COMPARE_BUTTON_STYLE}
          disabled={inFlight}
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
